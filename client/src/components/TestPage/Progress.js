import React from 'react';
import { MDBProgress, MDBProgressBar, MDBBadge } from 'mdb-react-ui-kit';
import { mapCount, mapAllCount } from './mapData';

const computeLength = (value) => value / mapAllCount * 100;

export default function Progress(props) {
  return (
    <>
      <MDBProgress height='15'>
        <MDBProgressBar animated striped bgColor='warning' width={props.num > mapCount.Rookie ? computeLength(mapCount.Rookie) : computeLength(props.num)} valuemin={0} valuemax={100} />
        <MDBProgressBar animated striped bgColor='success' width={props.num > mapCount.Rookie+mapCount.L3 ? computeLength(mapCount.L3) : computeLength(props.num-mapCount.Rookie)} valuemin={0} valuemax={100} />
        <MDBProgressBar animated striped bgColor='info' width={props.num > mapCount.Rookie+mapCount.L3+mapCount.L2 ? computeLength(mapCount.L2) : computeLength(props.num-mapCount.Rookie-mapCount.L3)} valuemin={0} valuemax={100} />
        <MDBProgressBar animated striped bgColor='danger' width={props.num > mapCount.Rookie+mapCount.L3+mapCount.L2+mapCount.L1 ? computeLength(mapCount.L1) : computeLength(props.num-mapCount.Rookie-mapCount.L3-mapCount.L2)} valuemin={0} valuemax={100} />
      </MDBProgress>
      <div className="text-center mt-2 fs-4"><MDBBadge>{props.num} / {mapAllCount}</MDBBadge></div>
      <br />
    </>
  );
}