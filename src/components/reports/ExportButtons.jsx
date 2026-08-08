import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function ExportButtons({

books,

members,

issues

}){

const exportPDF=()=>{

const doc=new jsPDF();

doc.text(

"Library Report",

14,

15

);

autoTable(doc,{

head:[["Title","Author","Category"]],

body:

books.map(book=>([

book.title,

book.author,

book.category

]))

});

doc.save("LibraryReport.pdf");

};

const exportExcel=()=>{

const sheet=

XLSX.utils.json_to_sheet(books);

const wb=

XLSX.utils.book_new();

XLSX.utils.book_append_sheet(

wb,

sheet,

"Books"

);

XLSX.writeFile(

wb,

"LibraryReport.xlsx"

);

};

return(

<div className="flex gap-4">

<button

onClick={exportPDF}

className="bg-red-600 text-white px-6 py-3 rounded-xl"

>

Export PDF

</button>

<button

onClick={exportExcel}

className="bg-green-600 text-white px-6 py-3 rounded-xl"

>

Export Excel

</button>

<button

onClick={()=>window.print()}

className="bg-blue-600 text-white px-6 py-3 rounded-xl"

>

Print

</button>

</div>

)

}