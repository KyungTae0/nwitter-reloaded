import {
  Unsubscribe,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );

      // 일반적인 쿼리로 가져오기
      // 실시간x
      // const snapshot = await getDocs(tweetsQuery);
      // const tweets = snapshot.docs.map((doc) => {
      //   const { tweet, createdAt, userId, username, photo } = doc.data();

      //   return {
      //     tweet,
      //     createdAt,
      //     userId,
      //     username,
      //     photo,
      //     id: doc.id,
      //   };
      // });

      // 구독도 다 비용임
      unsubscribe = await onSnapshot(tweetsQuery, (snapshop) => {
        const tweets = snapshop.docs.map((doc) => {
          // doc.type 로 어떤 상태로 변경되었는지 캐치할 수 있음
          // const tweets = snapshop.docChanges().map((doc) => {doc.type})
          const { tweet, createdAt, userId, username, photo } = doc.data();

          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setTweet(tweets);
      });
    };
    fetchTweets();

    // useEffect 는 이 컴포넌트가 안보일때 cleanup이 실행됨
    // useEffect tearDown
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
