import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { getFirestore, doc, updateDoc, collection } from "firebase/firestore";
import { auth } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseapi from "../../utils/firebaseapi";

import {
  DataCard,
  PhotoContainer,
  PhotoContainerImg,
  FormTextRead,
} from "./Readme";

const Wrapper = styled.div`
  display: block;
  max-width: 1376px;
  margin: 0 auto;
  margin-bottom: 100px;
`;
const Container = styled.div`
  margin-top: 50px;
  display: flex;
  height: 80vh;
`;
const LeftContainer = styled.div`
  margin-left: 20px;
  flex-grow: 1;
`;
const PreviewContainer = styled.div`
  margin-top: 20px;
  margin-right: 50px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  height: 50vh;
`;
const ReadmePreviewPhotoImg = styled.img`
  max-width: 100%;
  max-height: 100%;
`;
const ReadmePreviewPhoto = styled.div`
  padding: 10px;
  width: 100%;
  max-width: 200px;
  height: 200px;
`;
const RightContainer = styled.div`
  margin-right: 20px;
  flex-grow: 1.5;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  width: 750px;
`;
const FormGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: no-wrap;
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
  /* max-width: 600px; */
`;
const FormLabel = styled.div`
  width: 130px;
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
  display: block;
`;
const FormCheck = styled.div`
  margin-left: 8px;
  display: flex;
  align-items: center;
  /* & + & {
    margin-left: 30px;
  } */
`;
const FormCheckInput = styled.input`
  margin: 0;
  width: 15px;
  height: 16px;
`;
const FormCheckLabel = styled.label`
  margin-left: 5px;
  line-height: 26px;
`;
const FormText = styled.textarea`
  width: 80%;
  height: 100px;
  border-radius: 8px;
  resize: none;
`;
const FormControl = styled.input`
  width: 250px;
  height: 30px;
  border-radius: 8px;
  border: solid 1px #979797;
`;

const TextInputCard = styled.div`
  padding: 20px;
`;
const PhotoInputCard = styled.div`
  margin: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const UploadCardStyled = styled.label`
  background-color: #fff;
  padding: 10px;
  width: 100%;
  max-width: 400px;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
  position: relative;
  cursor: pointer;
`;
const UploadCardButton = styled.span`
  background-color: #fff;
  border: solid 2px #e6e6e6;
  padding: 10px 10px;
  border-radius: 30px;
  font-size: 17px;
  line-height: 1.24;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background-color: gray;
    color: #fff;
    transition: 1s;
  }
`;
const UploadCardInput = styled.input.attrs({
  type: "file",
  accept: "image/png, image/jpeg",
})`
  opacity: 0;
  z-index: -1;
  position: absolute;
`;
const UploadPreview = styled.div`
  max-width: 100%;
  max-height: 100%;
  text-align: center;
`;
const UploadPreviewImg = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const Btn = styled.button`
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

const WelcomeMsg = styled.div`
  margin-top: 30vh;
`;

const PreviewReadmeContainer = styled.div`
  display: flex;
`;
const PreviewReadmeContainerLeft = styled.div``;
const PreviewReadmeContainerRight = styled.div``;

export const BoxHeader = styled.div`
  padding: 16px;
  background-color: #f6f8fa;
  border-color: #d0d7de;
  border-style: solid;
  border-width: 1px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  margin: -1px -1px 0;
  display: flex;
  align-items: center;
`;

const Profile = () => {
  let navigate = useNavigate();
  const [getUser, setGetUser] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const db = getFirestore();
  const storage = getStorage();
  const [userData, setUserData] = useState<any>(null);
  const [showPreviewReadme, setShowPreviewReadme] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        var uid = user.uid;
        setGetUser(uid);
      }
    });
  }, []);

  // 使用者更新資訊
  type ListData = {
    lastname: string;
    firstname: string;
    age: number | undefined;
    gender: string;
    githublink: string;
    details: string;
    gender_interested: string;
    // inerested_gender: [];
    main_photo: string;
    wish_relationship: string;
    friend_list: [];
    friend_request: [];
    friend_sent_request: [];
  };

  const uploadFormGroups = [
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Occupation", key: "occupation" },
    { label: "Age", key: "age" },
    {
      label: "Gender",
      key: "gender",
      options: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Non-binary", value: "Non Binary" },
        { label: "Transgender", value: "Transgender" },
        { label: "Intersex", value: "Intersex" },
        { label: "Prefer not to say", value: "Prefer not to say" },
      ],
    },
    {
      label: "Interested in",
      key: "gender_interested",
      options: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Non-binary", value: "Non Binary" },
        { label: "Transgender", value: "Transgender" },
        { label: "Intersex", value: "Intersex" },
        { label: "Prefer not to say", value: "Prefer not to say" },
      ],
    },
    { label: "Githublink", key: "githublink" },
    {
      label: "Wish relationship",
      key: "wish_relationship",
      options: [
        { label: "Date", value: "date" },
        { label: "BFF", value: "bff" },
        { label: "Co-worker", value: "coworker" },
      ],
    },
    { label: "Details", key: "details", textarea: true },
  ];
  const [recipient, setRecipient] = useState<ListData>({
    lastname: "",
    firstname: "",
    age: undefined,
    gender: "",
    githublink: "",
    details: "",
    gender_interested: "",
    main_photo: "",
    wish_relationship: "",
    friend_list: [],
    friend_request: [],
    friend_sent_request: [],
  });
  const uploadFormInputCheck = (
    label: string,
    key: string,
    textarea: boolean | undefined,
    options: any
  ) => {
    if (options) {
      return (options as unknown as any[]).map((option) => (
        <FormCheck key={option.value}>
          <FormCheckInput
            type="radio"
            checked={recipient[key as keyof typeof recipient] === option.value}
            onChange={(e) => {
              if (e.target.checked)
                setRecipient({ ...recipient, [key]: option.value });
            }}
          />
          <FormCheckLabel>{option.label}</FormCheckLabel>
        </FormCheck>
      ));
    } else if (textarea) {
      return (
        <FormText
          value={recipient[key as keyof typeof recipient]}
          onChange={(e) =>
            setRecipient({ ...recipient, [key]: e.target.value })
          }
        />
      );
    } else {
      return (
        <FormControl
          value={recipient[key as keyof typeof recipient]}
          onChange={(e) =>
            setRecipient({ ...recipient, [key]: e.target.value })
          }
        />
      );
    }
  };
  const [fileSrc, setFileSrc] = useState<any>();
  const handleUploadPhoto = (e: any) => {
    if (!e.target.files[0]) return;
    var reader = new FileReader();
    reader.onload = function () {
      setFileSrc(reader.result);
    };
    reader?.readAsDataURL(e?.target?.files[0]);
    setImageUpload(e.target.files[0]);
  };

  const [showTextInput, setShowTextInput] = useState(false);
  const [hidePhotoInput, setHidePhotoInput] = useState(true);
  const [showWelcomeMsg, setShowWelcomeMsg] = useState(false);
  const [hideTitle, setHideTitle] = useState(true);

  // 上傳照片
  const uploadImage = async () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `users/${getUser}.jpg`);
    await uploadBytes(imageRef, imageUpload).then(() => {
      alert("uploaded photo!");
    });
    const downloadUrl = await getDownloadURL(imageRef);
    setImageURL(downloadUrl);
  };
  // 更新資料庫
  const updateDB = async () => {
    const userRef = doc(collection(db, "Users"), `${getUser}`);
    await updateDoc(userRef, { ...recipient, main_photo: imageURL });
    alert("updated README!");
    setShowPreviewReadme(true);
    await firebaseapi.readUserData(getUser).then((res) => {
      if (res) {
        setUserData(res);
      }
    });
    setShowWelcomeMsg(true);
    setShowTextInput(false);
    setHideTitle(false);
  };

  return (
    <>
      <Wrapper>
        <Container>
          <LeftContainer>
            <h1>
              Welcome to GitDate
              <br />
              We are glad that you are here
            </h1>
            <PreviewContainer>
              <BoxHeader>≡ Your README.md</BoxHeader>
              {showPreviewReadme && (
                <>
                  {userData && (
                    <>
                      <PreviewReadmeContainer>
                        <PreviewReadmeContainerLeft>
                          <PhotoContainer>
                            <PhotoContainerImg
                              src={userData.main_photo}
                              alt="main_photo"
                            />
                          </PhotoContainer>
                        </PreviewReadmeContainerLeft>
                        <PreviewReadmeContainerRight>
                          <FormTextRead>
                            <DataCard> Name </DataCard>
                            {userData.firstname} {userData.lastname}
                          </FormTextRead>
                          <FormTextRead>
                            <DataCard>Age</DataCard> {userData.age}
                          </FormTextRead>
                          <FormTextRead>
                            <DataCard> Gender </DataCard> {userData.gender}
                          </FormTextRead>
                          <FormTextRead>
                            <DataCard> Interested in </DataCard>
                            {userData.gender_interested}
                          </FormTextRead>
                          <FormTextRead>
                            <DataCard> GithubLink</DataCard>
                            <a
                              href={userData.githublink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {userData.githublink}
                            </a>
                          </FormTextRead>
                          <FormTextRead>
                            <DataCard> Details</DataCard>
                            {userData.details}
                          </FormTextRead>
                        </PreviewReadmeContainerRight>
                      </PreviewReadmeContainer>
                    </>
                  )}
                </>
              )}
              {/* {imageURL && (
                <ReadmePreviewPhoto>
                  <ReadmePreviewPhotoImg src={imageURL} alt="profile" />
                </ReadmePreviewPhoto>
              )} */}
            </PreviewContainer>
          </LeftContainer>
          <RightContainer>
            {hideTitle && (
              <BoxHeader>
                <h1>To write your README.md</h1>
              </BoxHeader>
            )}
            {hidePhotoInput && (
              <PhotoInputCard>
                <UploadCardStyled>
                  {fileSrc ? (
                    <>
                      <UploadPreview>
                        <UploadPreviewImg src={fileSrc} />
                      </UploadPreview>
                    </>
                  ) : (
                    <UploadCardButton>
                      Select your profile photo
                    </UploadCardButton>
                  )}
                  <UploadCardInput onChange={handleUploadPhoto} />
                </UploadCardStyled>
                <Btn onClick={uploadImage}>Upload photo</Btn>
                <br />
                <Btn
                  onClick={() => {
                    setShowTextInput(true);
                    setHidePhotoInput(false);
                  }}
                >
                  Continue
                </Btn>
              </PhotoInputCard>
            )}
            {showTextInput && (
              <>
                <TextInputCard>
                  {uploadFormGroups.map(({ label, key, textarea, options }) => (
                    <FormGroup key={key}>
                      <FormLabel>{label}</FormLabel>
                      {uploadFormInputCheck(label, key, textarea, options)}
                    </FormGroup>
                  ))}
                </TextInputCard>
                <Btn onClick={updateDB}>Update Profile</Btn>
              </>
            )}
            {showWelcomeMsg && (
              <WelcomeMsg>
                <h1>Let's explore GitDate!</h1>
              </WelcomeMsg>
            )}
          </RightContainer>
        </Container>
      </Wrapper>
    </>
  );
};

export default Profile;
