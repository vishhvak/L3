import Head from 'next/head';
import Header from '@components/Header';
import Footer from '@components/Footer';
import useSWR from 'swr';
import {useMemo, useState} from 'react';
import produce from 'immer';
import styles from '../styles/home.module.scss';

const fetcher_text = (url) =>
  fetch(url)
      .then((res) => {
        return res.text();
      })
      .catch((err) => console.log(err));

const fetcher_json = (url) =>
  fetch(url)
      .then((res) => {
        return res.json();
      })
      .catch((err) => console.log(err));

const API_KEY = 'b309cf1cdb2994bd19afed4fe3270e4d';

const Movie = ({movie}) => {
  const {data} = useSWR(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movie.name}`, fetcher_json);

  const result = useMemo(() => {
    if (!data) return;

    return data.results[0];
  }, [data]);

  console.log(result);

  return (
    <div key={movie.name} className={styles.movie}>
      <div className={styles.left}>
        <img className={styles.thumbnail} src={`https://image.tmdb.org/t/p/original/${result?.poster_path}`}/>
        <div className={styles.percentage}>{result?.vote_average}</div>
      </div>

      <div className={styles.right}>
        <div className={styles.meta}>
          <div className={styles.name}>
            {result?.original_title}
          </div>

          <div className={styles.year}>
            {movie.year}
          </div>
        </div>

        <div className={styles.overview}>
          {result?.overview}
        </div>
      </div>
    </div>);
};

export default function Home() {
  const [movies, setMovies] = useState([]);
  const {data} = useSWR('http://128.2.205.103:8082/recommend/231204', fetcher_text);

  const parsedData = useMemo(() => {
    if (!data) return;

    for (let i=0; i<data.split(',').length; i++) {
      const movie = data.split(',')[i];
      const name = movie.split('+').slice(0, -1).join(' ');
      const year = +movie.split('+').slice(-1)[0];

      setMovies(produce((draftMovies) => {
        draftMovies.push({'name': name, 'year': year});
      }));
    }
  }, [data]);

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        Welcome user X, here are your movie recommendations!
      </div>

      {
        movies.map((movie) => (
          <Movie {...{movie}}/>
        ))
      }
    </div>
  );
}
