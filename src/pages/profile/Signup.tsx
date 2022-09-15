import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { doc, setDoc, collection, getFirestore } from "firebase/firestore";
import { auth } from "../../utils/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import img01 from "./slider/slider01.jpg";
import img02 from "./slider/slider02.jpg";
import img03 from "./slider/slider03.jpg";
import img04 from "./slider/slider04.jpg";
import img05 from "./slider/slider05.jpg";
import img06 from "./slider/slider06.jpg";

const Wrapper = styled.div`
  display: block;
  width: 100%;
  margin: 0 auto;
`;

export const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #202637;
  border-radius: 6px;
  max-width: 576px;
  padding: 24px;
`;

export const Title = styled.div`
  font-size: 16px;
`;
const InputContainer = styled.div`
  margin-top: 20px;
`;
const FormGroup = styled.div``;
const FormLabel = styled.div``;
export const FormInputContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
`;
const FormControl = styled.input`
  border: 0px;
  width: 100%;
`;
const ContinueBtn = styled.button`
  border: 1px solid #627597;
  border-radius: 6px;
  background: none;
  padding: 5px 12px;
  cursor: pointer;
`;
export const SubmitBtn = styled.button`
  font-size: 16px;
  margin-top: 20px;
  width: 200px;
  border: 1px solid #627597;
  border-radius: 6px;
  background: none;
  padding: 5px 12px;
  cursor: pointer;
  &:hover {
    background-color: #edede9;
  }
`;
const InsideContainer = styled.div`
  width: 100%;
`;

const TextReminder = styled.div`
  margin-top: 5px;
  font-size: 16px;
  text-align: right;
`;
const SignInBtn = styled.button`
  padding: 5px;
  background: none;
  font-size: 16px;
  border: 0px;
  cursor: pointer;
  &:hover {
    background-color: gray;
    color: white;
  }
`;

const BlockInnerImg = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
  color: #333;
  height: calc(100vh - 64px);
  transition: 300ms;
`;
const BlockInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  max-width: 100%;
  padding: 16px;
`;
const BlockContent = styled.div`
  display: block;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  text-align: center;
  max-width: 680px;
  padding: 32px;
  /* @media screen and (min-width: 770px) {
    max-width: 680px;
    padding: 32px;
  } */
`;

const Signup = () => {
  const [photo, setPhoto] = useState(1);
  const db = getFirestore();
  const navigate = useNavigate();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipient, setRecipient] = useState({
    email: "",
    password: "",
  });

  const change = () => {
    if (photo === 7) {
      setPhoto(1);
      return;
    }
    setPhoto((prev) => prev + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      change();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [photo]);

  const returnPhotoURL = () => {
    switch (photo) {
      case 1:
        return img01;
      case 2:
        return img02;
      case 3:
        return img03;
      case 4:
        return img04;
      case 5:
        return img05;
      case 6:
        return img06;
      default:
        return img01;
    }
  };

  const onSubmit = () => {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, recipient.email, recipient.password)
      .then((res) => {
        setIsLoading(false);
      })
      .then(() => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            var uid = user.uid;
            await setDoc(doc(collection(db, "Users"), uid), {
              user_id: uid,
            });
          }
        });
      })
      .then(() => {
        navigate("/profile");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-in-use": {
            setErrorMsg("Email already in use");
            break;
          }
        }
        setIsLoading(false);
      });
  };

  const handleEmailInput = () => {
    if (!recipient.email) return;
    setShowPasswordInput(true);
  };
  const handlePasswordInput = () => {
    if (!recipient.password) return;
    setShowSignUp(true);
  };

  return (
    <>
      <Wrapper>
        <BlockInnerImg
          style={{
            backgroundImage: `url(${returnPhotoURL()})`,
          }}
        >
          <BlockInner>
            <BlockContent>
              <TextReminder>
                Already have account?
                <SignInBtn onClick={() => navigate("/signin")}>
                  Sign In ➜
                </SignInBtn>
              </TextReminder>
              <Container>
                <InsideContainer>
                  <Title>
                    Welcome to GitDate!
                    <br />
                    Let's begin the adventure
                  </Title>
                  <InputContainer>
                    <FormGroup key="email">
                      <FormLabel>Enter your email</FormLabel>
                      <FormInputContainer>
                        {showPasswordInput ? " ✔️ " : " ➜ "}
                        <FormControl
                          type="text"
                          value={recipient.email}
                          onChange={(e) =>
                            setRecipient({
                              ...recipient,
                              email: e.target.value,
                            })
                          }
                        />
                        <ContinueBtn onClick={handleEmailInput}>
                          Continue
                        </ContinueBtn>
                      </FormInputContainer>
                    </FormGroup>
                    {showPasswordInput && (
                      <FormGroup key="password">
                        <FormLabel>Create a password</FormLabel>
                        <FormInputContainer>
                          {showSignUp ? " ✔️ " : " ➜ "}
                          <FormControl
                            type="password"
                            value={recipient.password}
                            onChange={(e) =>
                              setRecipient({
                                ...recipient,
                                password: e.target.value,
                              })
                            }
                          />
                          <ContinueBtn onClick={handlePasswordInput}>
                            Continue
                          </ContinueBtn>
                        </FormInputContainer>
                      </FormGroup>
                    )}
                  </InputContainer>
                </InsideContainer>
                {/* {signInData.map(({ label, key, type }: ListData) => (
              <FormGroup key={key}>
                <FormLabel>{label}</FormLabel>
                <FormControl
                  type={type}
                  value={recipient[key as keyof recipientType]}
                  onChange={(e) =>
                    setRecipient({ ...recipient, [key]: e.target.value })
                  }
                />
              </FormGroup>
            ))} */}
                {errorMsg && <p>{errorMsg}</p>}
                {showSignUp && (
                  <SubmitBtn onClick={onSubmit}>
                    {isLoading ? "Loading" : "Sign Up"}
                  </SubmitBtn>
                )}
              </Container>
            </BlockContent>
          </BlockInner>
        </BlockInnerImg>
      </Wrapper>
    </>
  );
};

export default Signup;
