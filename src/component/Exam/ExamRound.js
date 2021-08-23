import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import styles from "../../component/Exam/LicenseExamStlye.module.css";
import {Container,InputWithLabel,InputWithLabelID,Wrapper,} from "../reuse/Shared";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { confirm } from "../../component/reuse/Comfirmation";
import api from "../../api/GetApi";
import { useHistory } from 'react-router-dom';
import { showSpinner  } from '../../action/Constants.action';
import { hideSpinner } from '../../action/Constants.action';
import { AuthenService } from '../../_services/authen.service';
import {useDispatch} from 'react-redux';

const ExamRound = (props) => {
  //   const history = useHistory();
  const [id, setId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [disableTime, setDisableTime] = useState(true);
  const [pressEdit, setPressEdit] = useState(false);
  const [result, setResult] = useState([]);
  let canInsert = false;
  let date = new Date().toISOString(); //2020-11-05T14:06:33.006Z
  let messageId = "028840ec147510517da2b23c8b0b6707";
  let create_user_code = "9009998";
  let update_user_code = "9009999";
  const dispathch = useDispatch();
  const history = useHistory();
  
  useEffect(() => {
    dispathch(showSpinner());
    setTimeout(function() {
      dispathch(hideSpinner())
    }, 500);

    const result =  AuthenService.checkPermission('Portfolio', 'AED');
    fetchData();
  }, []);



  //-----------------------for GET Method------------------
  // const fetchData = async () => {

  //   const { status, data } = await api.get("/searchExamRoundProcessAll");
  //   if (status === 200) {
  //     setResult(data.responseRecord.arrData); //เมื่อ setResult แล้ว ค่า result จะได้เป็นค่า arraylist ของ data สามารถนำค่า resultมาใช้ได้เลย เช่น result[0] คือ arrayตัวที่0
  //     console.log("result in fetchData >>>>>>>>>>>>>.. ",data.responseRecord.arrData);
  //   } else {
  //     alert("พบข้อผิดพลาดในการค้นหาข้อมูลรอบเวลาสอบ!");
  //   }
  // };

 
  //-----------------------for POST Method searchAll-------------------------
  const fetchData = async () => {
    const request = {
      headerData: {
        messageId: messageId,
        sentDateTime: date,
        responseDateTime: date,
      },
      requestRecord: {
        round_id: "",
        type: "A",
      },
    };

    const { status, data } = await api.post("/searchExamRoundProcess", request);
    if (status === 200) {
      setResult(data.responseRecord.arrData); //เมื่อ setResult แล้ว ค่า result จะได้เป็นค่า arraylist ของ data สามารถนำค่า resultมาใช้ได้เลย เช่น result[0] คือ arrayตัวที่0
      console.log("result in fetchData >>>>>>>>>>>>>.. ",data.responseRecord.arrData);
    } else {
      alert("พบข้อผิดพลาดในการค้นหาข้อมูลรอบเวลาสอบ!");
    }
  };

  //-------------------------for insert/update/delete--------------
  const doExamRoundProcess = async (round_id, time_str, processType) => {

    const request = {
      headerData: {
        messageId: messageId,
        sentDateTime: date,
        responseDateTime: date,
      },
      requestRecord: {
        round_id: round_id,
        time_str: time_str,
        create_user_code: create_user_code,
        create_time: "00.00",
        update_user_code: update_user_code,
        last_update: "00.00",
        processType: processType,
      },
    };
    const { status, data } = await api.post("/doExamRoundProcess", request);
    if (status === 200) 
    {
      // setResult(data.responseRecord.arrData); //เมื่อ setResult แล้ว ค่า result จะได้เป็นค่า arraylist ของ data สามารถนำค่า resultมาใช้ได้เลย เช่น result[0] คือ arrayตัวที่0
      console.log("result in doExamRoundProcess >>>>>>>>>>>>>.. ", data.responseStatus.status);
      if(data.responseStatus.status === 'S') //S=SUCCESS,E=ERROR
      {
          if (pressEdit) 
          {
            //ทำการ update row ในตาราง
            updateItem(id, "time_str", `${start}-${end}`);
            alert("บันทึกข้อมูลเรียบร้อยแล้ว");
          } 
          else 
          {
            if (processType === "D")
            {
              //delete row ในตาราง
              setResult(result.filter((item) => item.round_id !== round_id)); //ให้แสดงข้อมูลทั้งหมดใน result โดยไม่แสดง round_id ที่ส่งเข้ามา
              examRoundClear();
              alert("ลบข้อมูลเรียบร้อยแล้ว");
            }
            else 
            {
              //add row ในตาราง
              setResult([...result, { round_id: id, time_str: `${start}-${end}` }]);
              alert("บันทึกข้อมูลเรียบร้อยแล้ว");
            }
          }
        }
        else
          alert("พบข้อผิดพลาด!");
    } 
    else {
      alert("พบข้อผิดพลาด! ",status);

    }

  };

  // const fetchData = async () => {

  //   const { status, data } = await api.get("/searchExamRoundProcessAll");
  //   if (status === 200) {

  //     setResult(data.responseRecord.arrData); //เมื่อ setResult แล้ว ค่า result จะได้เป็นค่า arraylist ของ data สามารถนำค่า resultมาใช้ได้เลย เช่น result[0] คือ arrayตัวที่0
  //    // console.log("result in fetchData >>>>>>>>>>>>> ", data.responseRecord.arrData);
  //   }
  //   else
  //   {
  //     alert("error");
  //   }
  // };

  const checkDuplicateData = () => {
    //check ข้อมูลซ้ำก่อนกดบันทึก ให้ alert แจ้งเตือน ไม่ให้บันทึก
    const dup = result.find((o) => o.time_str === `${start}-${end}`);
    if (typeof dup !== "undefined" && dup != null) {
      alert("พบข้อมูลซ้ำในระบบ กรุณาบันทึกรอบเวลาใหม่!");
      canInsert = false;
    } else canInsert = true;
  };

  const examRoundSave = () => {
    if (start === "") {
      alert("Start time is required!");
    } else if (end === "") {
      alert("End time is required!");
    } else 
    {
      checkDuplicateData();
      if (canInsert) 
      {
        if (pressEdit) 
          doExamRoundProcess(id,`${start}-${end}`,"S" );
        else 
          doExamRoundProcess("",`${start}-${end}`, "S");

        //-----------------------------------------------------------------------
        examRoundClear();
        setDisableTime(true);
      } 
      else setDisableTime(false);
    }
  };

  const getListRoundID = (roundTime, index) => {
    return roundTime.round_id;
  };

  const examRoundAdd = () => {
    setPressEdit(false);
    setStart("");
    setEnd("");
    setDisableTime(false);

    let max = Math.max.apply(null, result.map(getListRoundID));

    let newRound = String(parseInt(max) + 1);
    if (newRound.length === 1) newRound = "0" + newRound;

    setId(newRound);
  };

  const examRoundClear = () => {
    setPressEdit(false);
    setStart("");
    setEnd("");
    setId("");
    setDisableTime(true);
  };

  const dlgConfirm = async (param) => {
    if (await confirm("ต้องการลบข้อมูลใช่หรือไม่?")) 
    {
      doExamRoundProcess(param.round_id,`${param.time_str}`,"D");
    }
  };
  const removeData = (param) => {
    setPressEdit(false);
    dlgConfirm(param);
  };

  const updateItem = (round_id, whichvalue, newvalue) => {
    var index = result.findIndex((x) => x.round_id === round_id);

    let g = result[index];
    g[whichvalue] = newvalue;
    if (index === -1) {
      // handle error
      console.log("no match");
    } else
      setResult([...result.slice(0, index), g, ...result.slice(index + 1)]);
  };

  const editData = (param) => {
    setPressEdit(true);
    setId(param.round_id);
    setStart(param.time_str.substring(0, 5));
    setEnd(param.time_str.substring(6));

    setDisableTime(false);
  };

  
  const renderRoundTime = (roundTime, index) => {
    return (
      <tr className={styles.title} key={index}>
        <td>{roundTime.round_id}</td>
        <td>{roundTime.time_str}</td>

        <td className={styles.operation}>
          <button
            className={styles.buttonEdit}
            onClick={() => editData(roundTime)}
          >
            แก้ไข
          </button>
        </td>

        <td className={styles.operation}>
          <button
            className={styles.buttonDelete}
            onClick={() => removeData(roundTime)}
          >
            ลบ
          </button>
        </td>
      </tr>
    );
  };
  return (
    <Container>
      <Wrapper>
        <br></br>
        <h2 className={styles.title}>ตั้งค่าเวลาสอบ</h2>
        <br></br>
        <div>
          <table>
            <tr>
              <td>
                <InputWithLabelID
                  label="รหัส"
                  value={id}
                  onChange={(e) => {
                    setId(e.target.value);
                  }}
                />
              </td>
              &nbsp;
              <td>
                <InputWithLabel
                  label="เวลาสอบเริ่มต้น"
                  value={start}
                  onChange={(e) => {
                    setStart(e.target.value);
                  }}
                  showTime={disableTime}
                />
              </td>
              &nbsp;
              <td>
                <InputWithLabel
                  label="เวลาสอบสิ้นสุด"
                  type="end"
                  value={end}
                  onChange={(e) => {
                    setEnd(e.target.value);
                  }}
                  showTime={disableTime}
                />
              </td>
            </tr>
          </table>
        </div>

        <div className={styles.flexend}>
          <tr>
            <td>
              <Button color="success" type="button" onClick={examRoundAdd}>
                เพิ่มรอบใหม่
              </Button>
              &nbsp;
            </td>
          </tr>
        </div>

        <MDBTable striped bordered scrollY hover size="sm">
          <MDBTableHead>
            <tr className={styles.head}>
              <th>รหัสรอบเวลาสอบ</th>
              <th>รอบเวลารอบ</th>
              <th>แก้ไข</th>
              <th>ลบ</th>
            </tr>
          </MDBTableHead>
          {/* <MDBTableBody rows={data.rows} /> */}
          <MDBTableBody>{result.map(renderRoundTime)}</MDBTableBody>
        </MDBTable>

        <br></br>
        <div className={styles.center}>
          <tr>
            <td>
              <Button color="primary" type="button" onClick={examRoundSave}>
                บันทึก
              </Button>
              &nbsp;&nbsp;&nbsp;
            </td>
            <td>
              <Button color="secondary" type="button" onClick={examRoundClear}>
                เคลียร์ข้อมูล
              </Button>
            </td>
          </tr>
        </div>
      </Wrapper>
    </Container>
  );
};

export default ExamRound;
