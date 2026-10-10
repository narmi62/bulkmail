const  fileInput=document.getElementById("fileInput");

fileInput.addEventListener("change",(eve)=>
{
   const file=eve.target.files[0];
   const reader = new FileReader();
   reader.onload = function(event)
   {
    const data = event.target.result;
    const workbook = XLSX.read(data,{type:"Array"})
     const sheetName = workbook.SheetNames[0];
     const worksheet = workbook.Sheets[sheetName];
     const emailList = XLSX.utils.sheet_to_json(worksheet,{header:"A"})
     console.log(emailList);
   }
   reader.readAsArrayBuffer(file);
   console.log(file)
})