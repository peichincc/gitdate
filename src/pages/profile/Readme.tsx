import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import firebaseapi from "../../utils/firebaseapi";
import {
  getFirestore,
  doc,
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { BoxHeader } from "./Profile";
import { NavWord } from "../../utils/StyledComponent";
import PostedIssues from "../../components/user/PostedIssues";
import HostedBranches from "../../components/user/HostedBranches";
import AttendedBranches from "../../components/user/AttendedBranches";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../components/Loading";
import { GoBackWrapper, Button, GithubLink } from "../../utils/StyledComponent";

import SourceTree from "./Graph";
import ToggleOn from "../../assets/images/toggle-on.svg";
import ToggleOff from "../../assets/images/toggle-off.svg";

const Wrapper = styled.div`
  width: 90%;
  display: block;
  max-width: 1216px;
  margin: 0 auto;
`;
const Container = styled.div`
  width: 100%;
  margin-top: 20px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  height: auto;
`;
const InsideContainder = styled.div`
  height: auto;
  display: flex;
  margin-top: 20px;
  @media screen and (max-width: 770px) {
    flex-direction: column;
  }
`;
const LeftContainer = styled.div`
  margin-left: 20px;
  margin-bottom: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  @media screen and (max-width: 770px) {
    width: 100%;
  }
`;
export const PhotoContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  width: 200px;
  height: 200px;
`;
export const PhotoContainerImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;
const RightContainer = styled.div`
  margin-left: 20px;
  flex-grow: 4;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 70%;
  @media screen and (max-width: 770px) {
    width: 100%;
  }
`;
const NameCard = styled.div`
  padding-top: 8px;
`;
const ToggleOnBtn = styled(Button)`
  display: flex;
  align-items: center;
  margin-top: 20px;
  justify-content: space-evenly;
  width: 150px;
  padding: 2px;
  @media screen and (max-width: 500px) {
    display: none;
  }
`;

export const FormTextRead = styled.div`
  line-height: 19px;
  font-size: 16px;
  color: #3f3a3a;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: 5px;
  margin-bottom: 10px;
`;
export const DataCard = styled.div`
  border-radius: 8px;
  background-color: #edede9;
  padding: 5px;
  margin-right: 10px;
  width: 120px;
  text-align: center;
`;

const Readme = () => {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const db = getFirestore();
  const { id } = useParams<any>();
  type ListData = {
    lastname: string;
    firstname: string;
    age: number | undefined;
    gender: string;
    githublink: string;
    details: string;
    gender_interested: string;
    main_photo: string;
    wish_relationship: string;
  };
  // const [userData, setUserData] = useState<ListData | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [postedIssues, setPostedIssues] = useState<DocumentData>();
  const [hostedBranches, setHostedBranches] = useState<DocumentData>();
  const [attendedBranches, setAttendedBranches] = useState<DocumentData>();
  const [sourceTreeStatus, setSourceTreeStatus] = useState(0);

  useEffect(() => {
    firebaseapi.readUserData(id).then((res) => {
      if (res) {
        console.log(res);
        if (res.firstname) {
          setSourceTreeStatus(1);
        }
        if (res["activity_hosted"]) {
          if (res["activity_hosted"].length > 0) {
            setSourceTreeStatus(3);
          }
        }
        if (res["activity_attend"]) {
          if (res["activity_attend"].length > 0) {
            setSourceTreeStatus(4);
          }
        }
        if (res["activity_attend"] && res["activity_hosted"]) {
          if (
            res["activity_attend"].length > 0 &&
            res["activity_hosted"].length > 0
          ) {
            setSourceTreeStatus(5);
          }
        }
        setUserData(res);
        console.log(res.user_id);
        searchIssues(res.user_id);
        searchHostedBranches(res.user_id);
        searchAttenedBranches(res.user_id);
        setIsLoading(false);
      }
    });
  }, [id]);

  // 搜尋使用者發過的文
  const searchIssues = async (userId: string) => {
    let temp = [] as any;
    const q = query(collection(db, "Issues"), where("posted_by", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      temp.push(doc.data());
    });
    setPostedIssues(temp);
  };
  // 搜尋使用者的活動
  const searchHostedBranches = async (userId: string) => {
    let temp = [] as any;
    const q = query(
      collection(db, "Branches"),
      where("hosted_by", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      temp.push(doc.data());
    });
    setHostedBranches(temp);
  };
  const searchAttenedBranches = async (userId: string) => {
    onSnapshot(doc(collection(db, "Users"), userId), async (doc) => {
      if (doc.exists()) {
        console.log(doc.data().activity_attend);
        const newArr = [] as any;
        for (let i = 0; i < doc.data().activity_attend.length; i++) {
          await firebaseapi
            .readBranchData(doc.data().activity_attend[i])
            .then((res) => {
              if (res) {
                const tempObj = {
                  id: res["branch_id"],
                  title: res["title"],
                  photo: res["main_image"],
                };
                newArr.push(tempObj);
              }
            });
        }
        setAttendedBranches(newArr);
      }
    });
  };

  const [ButtonPop, setButtonPop] = useState(false);

  return (
    <>
      <Wrapper>
        {ButtonPop ? (
          <SourceTree
            // trigger={ButtonPop}
            setButtonPop={setButtonPop}
            sourceTreeStatus={sourceTreeStatus}
          />
        ) : null}
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {userData && (
              <>
                <Container>
                  <BoxHeader>
                    <FontAwesomeIcon icon={faListUl} />{" "}
                    <NavWord>README.md</NavWord>
                  </BoxHeader>
                  <InsideContainder id="readme">
                    <LeftContainer>
                      <PhotoContainer>
                        <PhotoContainerImg
                          src={userData.main_photo}
                          alt="main_photo"
                        />
                      </PhotoContainer>
                      <NameCard>
                        <b>
                          {userData.firstname} {userData.lastname}
                        </b>
                      </NameCard>
                      <NameCard>{userData.occupation}</NameCard>
                      <ToggleOnBtn
                        id="sourcetree"
                        onClick={() => {
                          setButtonPop((pre) => !pre);
                        }}
                      >
                        Sourcetree
                        {ButtonPop ? (
                          <img src={ToggleOn} alt="ToggleBtn" />
                        ) : (
                          <img src={ToggleOff} alt="ToggleBtn" />
                        )}
                      </ToggleOnBtn>
                    </LeftContainer>
                    <RightContainer>
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
                        <DataCard> Wish relationship </DataCard>
                        {userData.wish_relationship}
                      </FormTextRead>
                      <FormTextRead>
                        <DataCard> GithubLink</DataCard>
                        <a
                          href={userData.githublink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <GithubLink>{userData.githublink}</GithubLink>
                        </a>
                      </FormTextRead>
                      <FormTextRead>
                        <DataCard> Details</DataCard>
                        {userData.details}
                      </FormTextRead>
                    </RightContainer>
                    {/* <TreeContainer>
                      <TreeGraph>
                        <SourceTree
                          sourceTreeStatus={sourceTreeStatus}
                          id="gitgraph"
                        />
                      </TreeGraph>
                    </TreeContainer> */}
                  </InsideContainder>
                </Container>
                {postedIssues && <PostedIssues postedIssues={postedIssues} />}
                {hostedBranches && (
                  <>
                    <HostedBranches hostedBranches={hostedBranches} />
                    <AttendedBranches attendedBranches={attendedBranches} />
                  </>
                )}
              </>
            )}
          </>
        )}
        <GoBackWrapper>
          <Button onClick={() => navigate(-1)}>Go back</Button>
        </GoBackWrapper>
      </Wrapper>
    </>
  );
};

export default Readme;
