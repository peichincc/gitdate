import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ResultBox = styled.div`
  width: 100%;
  height: auto;
  color: black;
  z-index: 999;
`;
const Results = styled.div`
  cursor: pointer;
  padding: 5px;
  display: flex;
  &:hover {
    background-color: #edede9;
  }
`;
const PhotoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;
const PhotoContainerImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const SearchResults = ({ searchResults }: any) => {
  let navigate = useNavigate();
  return (
    <>
      {searchResults &&
        searchResults.map((user: any) => (
          <>
            <ResultBox>
              <Results
                onClick={() => {
                  navigate("/readme/" + user["user_id"]);
                }}
              >
                <PhotoContainer>
                  <PhotoContainerImg src={user["main_photo"]} />
                </PhotoContainer>
                <div>
                  {user["firstname"]} {user["lastname"]}
                </div>
              </Results>
            </ResultBox>
          </>
        ))}
    </>
  );
};

export default SearchResults;