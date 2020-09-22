import React from "react";

export default function QRCode(props){
    const React = require('react');
    const QRCode = require('qrcode.react');
    return(
    <QRCode value={props.url}
            size={132}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={false}
            renderAs={"svg"}
            />
    );
}