import React from "react";
import { QRCode } from "react-qrcode-logo";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const QRcode = (props) => {
  return (
    <div>
      <QRCode
        size={200}
        // width={100}
        // style={{width: "100%", height:"100%"}}
        // style={{padding:"10px"}}
        // renderAs="canvas"
        ecLevel="H"
        // removeQrCodeBehindLogo="true"
        // logoImage={
        //   props?.res?.data?.result?.owner?.profileImage?.Location ||
        //   "/logo.png"
        // }
        //     value={`${hostName}/?x=${props?.res?.data?.result?.identifier}`}
        value={props?.identifier}
      />

      <Image
        src={
          // props?.res?.data?.result?.owner?.profileImage?.Location ||
          props?.logo || "/logo.png"
        }
        width="50"
        height={50}
        className="qrLogo"
      />
    </div>
  );
};

export default QRcode;
