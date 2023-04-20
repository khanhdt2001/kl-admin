import React from "react";
import Mylogin from "./page/Mylogin";
import MyListNFT from "./page/MyListNFT";
import { Route, Routes, Navigate } from "react-router-dom";
const MyRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<Mylogin />}></Route>
            <Route path="/nfts" element={<MyListNFT/>}></Route>
        </Routes>
    );
};

export default MyRouter;
