import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";

const Button = styled.span`
  margin-top: 50px;
  background-color: white;
  font-weight: 500;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;
export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      // firebase에서 github OAuth를 사용하기 위한 provider를 생성함
      const provider = new GithubAuthProvider();
      // signInWithRedirect 도 있음
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error(1212, error);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" />
      Continue with Github
    </Button>
  );
}
