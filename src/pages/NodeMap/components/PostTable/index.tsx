import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';

interface IrowData {
  title: string;
  name: string;
  date: string;
}

function PostTable() {
  const [data] = useState<IrowData[]>([
    { title: '[React] 공부1', name: '사이다', date: '2023-04-13' },
    { title: '[React] 공부2', name: '사이다2', date: '2023-04-24' },
    { title: '[React] 공부3', name: '사이다3', date: '2023-04-25' },
    { title: '[React] 공부4', name: '콜라1', date: '2023-04-13' },
    { title: '[React] 공부5', name: '제로콜라1', date: '2023-04-13' },
    { title: '[React] 공부6', name: '콜라2', date: '2023-04-13' },
    { title: '[React] 공부7', name: '제로콜라2', date: '2023-04-13' },
    { title: '[React] 공부8', name: '갈아만든배1', date: '2023-04-25' },
    { title: '[React] 공부9', name: '갈아만든배2', date: '2023-04-25' },
    { title: '[React] 공부10', name: '갈아만든배3', date: '2023-04-25' },
    { title: '[React] 공부11', name: '갈아만든배4', date: '2023-04-25' },
    { title: '[React] 공부12', name: '갈아만든배5', date: '2023-04-25' },
  ]);

  const [columnDefs] = useState([
    { field: 'title' },
    { field: 'name' },
    { field: 'date' },
  ]);

  return (
    <div
      className="ag-theme-alpine"
      style={{ width: 750, height: 550, margin: 'auto auto' }}
    >
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          minWidth: 100,
          width: 300,
          flex: 1,
        }}
      ></AgGridReact>
    </div>
  );
}

export default PostTable;
