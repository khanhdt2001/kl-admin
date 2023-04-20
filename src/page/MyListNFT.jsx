import React, { useState, useEffect } from "react";
import { Avatar, Card, Button, Row, Col, Input, Form } from "antd";
import { alchemy, sliceString } from "../function/MyFunction";
import axios from "axios";
import verified from "../image/verified.png";
import ethLogo from "../image/ethereum.png";
import "../css/MyListNFT.css";
const { Meta } = Card;
const MyListNFT = () => {
    const [isCallingApi, setIsCallingApi] = useState(true);
    const [listNft, setListNft] = useState([]);
    const [localdata, setLocaldata] = useState([]);
    const [currentNFT, setCurrentNFT] = useState();
    const [form] = Form.useForm();
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
        if (currentNFT && currentNFT.address === form.getFieldValue("address").toLowerCase()) {
            await axios
            .post("http://localhost:5000/nfts", {
                webAddress: form.getFieldValue("address"),
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        }   
        form.submit();

    };
    const onChangeAddress = async () => {
        const data = await alchemy.nft.getContractMetadata(
            form.getFieldValue("address")
        );
        if (data) {
            setCurrentNFT(data);
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
                                        <img src={ethLogo} />
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
                                        <img src={ethLogo} />
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
                            rules={[
                                {
                                    required: true,
                                    message: "Please input NFT address!",
                                },
                            ]}
                        >
                            <Input
                                onChange={onChangeAddress}
                            />
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
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default MyListNFT;
