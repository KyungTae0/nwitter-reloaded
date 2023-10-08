import { styled } from "styled-components";
import { ITweet } from "./timeline";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import {
  AttachFileButton,
  AttachFileInput,
  AttachFileLabel,
} from "./post-tweet-form";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  cursor: pointer;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Input = styled.input`
  type: text;
  margin: 20px 0px;
  display: flex;
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 80%;
  font-size: 18px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const UpdateButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [isEdditing, setIsEdditing] = useState(false);
  const [tweets, setTweets] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // 파일 변경
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > 1000000) {
        return;
      }
      setFile(files[0]);
    }
  };

  // 파일 업로드 및 파일 url 업데이트
  const updatePhoto = async () => {
    if (file) {
      const ok = confirm("Are you sure you want to update photo this tweet?");
      if (!ok) {
        return false;
      }
      // 저장할 파일 위치 주소 생성
      const locationRef = ref(storage, `tweets/${user?.uid}/${id}`);

      // 바이트로 변환 후 스토리지에 파일 업로드
      const result = await uploadBytes(locationRef, file);
      // 업로드한 파일 주소 반환
      const url = await getDownloadURL(result.ref);

      // 새로운 파일 주소로 tweet photo 주소 업데이트
      await updateDoc(doc(db, "tweets", id), {
        photo: url,
      });

      // 기존 파일 주소
      const photoRef = ref(storage, `tweets/${user?.uid}/${id}`);
      // 기존 파일 삭제
      await deleteObject(photoRef);

      alert("complete upload file");
    }
  };

  useEffect(() => {
    updatePhoto();
  }, [file]);

  // 글 + 사진 삭제
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) {
      return;
    }
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  // 글 수정
  const onUpdate = async () => {
    const ok = confirm("Are you sure you want to update this tweet?");

    if (!ok || user?.uid !== userId) {
      return;
    }
    try {
      await updateDoc(doc(db, "tweets", id), {
        tweet: tweets,
      });
    } catch (e) {
    } finally {
      setIsEdditing(false);
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEdditing ? (
          <Input
            defaultValue={tweet}
            onChange={(e) => setTweets(e.target.value)}
          ></Input>
        ) : (
          <Payload>{tweet}</Payload>
        )}

        {user?.uid === userId ? (
          <>
            {isEdditing ? (
              <>
                <UpdateButton onClick={onUpdate}>Confirm</UpdateButton>
                <DeleteButton onClick={() => setIsEdditing(false)}>
                  Cancle
                </DeleteButton>
              </>
            ) : (
              <>
                <UpdateButton
                  onClick={() => {
                    setIsEdditing(true);
                  }}
                >
                  Update
                </UpdateButton>
                <DeleteButton onClick={onDelete}>Delete</DeleteButton>
              </>
            )}
          </>
        ) : null}
      </Column>
      <Column>
        {photo ? (
          <>
            <AttachFileLabel htmlFor="file2">
              <Photo src={photo} />
            </AttachFileLabel>
            <AttachFileInput
              onChange={(e) => {
                onFileChange(e);
              }}
              type="file"
              id="file2"
              accept="image/*"
            />
          </>
        ) : null}
      </Column>
    </Wrapper>
  );
}
