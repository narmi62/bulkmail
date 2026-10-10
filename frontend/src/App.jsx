import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
function App() {

  const [msg, setMsg] = useState("");
  const [sub, setSub] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList,setEmailList]=useState([]);


  const handlesub = (eve) =>
  {
    setSub(eve.target.value)
  }

  const handlemsg = (eve) => {
    setMsg(eve.target.value);

  }

  const handlefile= (eve)=>
  {
   const file= eve.target.files[0];
   const reader = new FileReader();
   reader.onload = function(event)
   {
    const data = event.target.result;
    const workbook = XLSX.read(data,{type:"Array"})
     const sheetName = workbook.SheetNames[0];
     const worksheet = workbook.Sheets[sheetName];
     const emailList = XLSX.utils.sheet_to_json(worksheet,{header:"A"})
     const totalemail = emailList.map(function(item){return item.A})
     console.log(totalemail);
     setEmailList(totalemail);
   }
   reader.readAsArrayBuffer(file);
   console.log(file)
  }

  function sendmsg() {
    setStatus(true);

    axios.post("http://localhost:5000/sendemail", { sub:sub,msg:msg,emailList:emailList })
      .then((response) => {
        console.log("Response:", response.data);
        console.log("Type:", typeof response.data);

        if (String(response.data).trim() === "true") {
          alert("Email sent Successfully");
          setStatus(false);
        } else {
          alert("Email sending failed");
        }


      })
      .catch((error) => {
        console.log("Error:", error);
        alert("Something went wrong");
        setStatus(false);
      });
  }
  return (
    <div>
      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">Bulk Mail</h1>
      </div>

      <div className="bg-blue-800 text-white text-center">
        <h1 className="font-medium px-5 py-3">We can help your business sending multiple emails at once</h1>
      </div>

     <div className="bg-blue-600 text-center p-2 ">
        <label>Subject: </label>
        <input type="text" onChange={handlesub} value={sub} className="border border-black rounded-md text-center h-8 w-[60%]" placeholder="Enter subject"></input>
      </div>


      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea onChange={handlemsg} value={msg} className="w-[80%] h-32 py-2 outline-none px-2 border border-black rounded-md" placeholder="Enter the email text....."></textarea>
        <div>

          <input type="file" onChange={handlefile} className="border-4 border-dashed py-4 px-4 mt-5 mb-5"></input>

        </div>
        <p>Total emails in the file: {emailList.length}</p>


        <button onClick={sendmsg} className="mt-2 bg-blue-950 py-2 px-2 text-white font-medium rounded-md w-fit">{status ? "Sending..." : "Send"}</button>

      </div>

      <div className="bg-blue-300 text-white text-center p-8">

      </div>

      <div className="bg-blue-200 text-white text-center p-8">
      </div>

    </div>


  )
}
export default App;