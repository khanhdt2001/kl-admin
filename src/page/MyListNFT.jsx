import React, { useState, useEffect } from "react";
import { Avatar, Card, Button, Row, Col, Input, Form, Modal } from "antd";
import {
    alchemy,
    sliceString,
    RegisterNFT,
    UnRegisterNFT,
} from "../function/MyFunction";
import axios from "axios";
import verified from "../image/verified.png";
import ethLogo from "../image/ethereum.png";
import "../css/MyListNFT.css";
const { ethereum } = window;
const { Meta } = Card;
const MyListNFT = () => {
    const [isCallingApi, setIsCallingApi] = useState(true);
    const [listNft, setListNft] = useState([]);
    const [localdata, setLocaldata] = useState([]);
    const [currentNFT, setCurrentNFT] = useState();
    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [delNFT, setDelNFT] = useState();
    const [metaDataa, setMetadata] = useState();
    const [popUpTitle, setPopUpTitle] = useState("");
    const [msg, setMsg] = useState("");
    const [nftAddress, setNftAddress] = useState("");
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [isBtnLoading, setisBtnLoading] = useState(false);
    useEffect(() => {
        const GetNftLocal = async () => {
            await axios.get("http://localhost:5000/nfts").then(
                async (response) => {
                    const dataLocal = response.data.nfts;
                    setLocaldata(dataLocal);
                    const data =
                        (await Promise.all(
                            dataLocal.map((nft) =>
                                alchemy.nft.getContractMetadata(nft.webAddress)
                            )
                        )) || [];
                    setListNft(data);
                    setIsCallingApi(false);
                },
                (error) => {
                    console.log(error);
                }
            );
        };
        if (isCallingApi) {
            GetNftLocal();
        }
    }, [isCallingApi]);
    const onOk = async () => {
        console.log("calling smart contract");
        var addressData;
        const listAccount = await ethereum.request({
            method: "eth_requestAccounts",
        });
        addressData = listAccount[0];
        setisBtnLoading(true);
        try {
            const res = await RegisterNFT(
                addressData,
                form.getFieldValue("address")
            );
            setTimeout(() => {
                setIsCallingApi(true);
                form.resetFields();
                setCurrentNFT();
                setisBtnLoading(false);
            }, 3000);
            console.log(res);
        } catch (error) {
            console.log(error);
            setisBtnLoading(false);

        }
    };
    const onChangeAddress = async () => {
        const data = await alchemy.nft.getContractMetadata(
            form.getFieldValue("address")
        );
        if (data) {
            setCurrentNFT(data);
        }
    };
    const onclickDel = (data, beta) => {
        setOpenModal(true);
        setDelNFT(data);
        setMetadata(beta);
        setPopUpTitle(`You want to delete ${beta?.name} ?`);
        setMsg("You want to delete this NFT");
    };
    const handleCancel = () => {
        setOpenModal(false);
    };
    const deleteNFT = async () => {
        var addressData;
        const listAccount = await ethereum.request({
            method: "eth_requestAccounts",
        });
        addressData = listAccount[0];
        setConfirmLoading(true);
        try {
            const res = await UnRegisterNFT(addressData, delNFT.webAddress);
            console.log("res", res);
            setTimeout(() => {
                setIsCallingApi(true);
                setOpenModal(false);
            setConfirmLoading(false);

            }, 3000);
            console.log(res);
        } catch (error) {
            setConfirmLoading(false);

            console.log(error);
        }

    };
    return (
        <div className="my_list_nft">
            <ul className="market__list ">
                {localdata?.map((nftData, index) => (
                    <li className="market__item" key={nftData._id}>
                        <Card className="market_li_card" hoverable>
                            <Meta
                                avatar={
                                    <Avatar
                                        size={64}
                                        src={listNft[index]?.openSea.imageUrl}
                                    />
                                }
                            />
                            <Row className="market_li_description">
                                <Row>
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            height: 0,
                                            lineHeight: 0,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {listNft[index]?.name}
                                        <Meta
                                            className="market_description_checked"
                                            avatar={
                                                <Avatar
                                                    size={24}
                                                    src={verified}
                                                />
                                            }
                                        />
                                    </span>
                                </Row>
                                <Row className="market_description_content">
                                    <Col className="col-with-img">
                                        Fool price {nftData.price}
                                        <img src={ethLogo} alt="nft-logo" />
                                    </Col>
                                    <Col>
                                        <p style={{ display: "inline" }}>
                                            NFT in collection:{" "}
                                        </p>
                                        {listNft[index]?.totalSupply}
                                    </Col>
                                    <Col className="col-with-img">
                                        Minimum to borrow{" "}
                                        {sliceString(
                                            localdata[index]?.price / 3
                                        )}
                                        <img src={ethLogo} alt="nt-logo" />
                                    </Col>
                                    <Col className="delete_btn">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            danger
                                            onClick={() => {
                                                onclickDel(
                                                    localdata[index],
                                                    listNft[index]
                                                );
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Col>
                                </Row>
                            </Row>
                        </Card>
                    </li>
                ))}
            </ul>
            <div className="form_admin">
                <Card className="market_li_card" hoverable>
                    <Meta
                        avatar={
                            <Avatar
                                size={64}
                                src={currentNFT?.openSea.imageUrl}
                            />
                        }
                    />
                    <Form form={form} className="form_input">
                        <Form.Item
                            label="NFT address"
                            name="address"
                            value={nftAddress}
                            rules={[
                                {
                                    required: true,
                                    message: "Please input NFT address!",
                                },
                                {
                                    validator: async (rule, value) => {
                                        console.log("validate nft", value);
                                        await axios
                                            .post(
                                                "http://localhost:5000/nfts",
                                                {
                                                    webAddress: value,
                                                }
                                            )
                                            .then(function (response) {
                                                if (
                                                    response.data ===
                                                    "found in supported NFT"
                                                ) {
                                                    onChangeAddress();
                                                }
                                            })
                                            .catch(function (error) {
                                                console.log("error", error);
                                                return Promise.reject(
                                                    "This NFT does not meet the requirement"
                                                );
                                            });

                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={onOk}
                                loading= {isBtnLoading}
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
            <Modal
                title={popUpTitle}
                open={openModal}
                onOk={deleteNFT}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
            >
                <Meta
                    avatar={
                        <Avatar size={64} src={metaDataa?.openSea.imageUrl} />
                    }
                />
                <p>{msg}</p>
            </Modal>
        </div>
    );
};

export default MyListNFT;
