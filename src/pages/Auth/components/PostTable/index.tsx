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
    { title: '[React] 공부3', name: '제로사이다', date: '2023-04-25' },
    { title: '펩시', name: '콜라', date: '2023-04-13' },
    { title: '펩시', name: '제로콜라', date: '2023-04-13' },
    { title: '코카콜라', name: '콜라2', date: '2023-04-13' },
    { title: '코카콜라', name: '제로콜라3', date: '2023-04-13' },
    { title: '해태', name: '갈아만든배', date: '2023-04-25' },
    { title: '해태', name: '갈아만든배', date: '2023-04-25' },
    { title: '해태', name: '갈아만든배', date: '2023-04-25' },
    { title: '해태', name: '갈아만든배', date: '2023-04-25' },
    { title: '해태', name: '갈아만든배', date: '2023-04-25' },
  ]);

  // 정렬 및 필터 설정
  const [columnDefs] = useState([
    { field: 'title' },
    { field: 'name' },
    { field: 'date' },
  ]);

  // headerName <- 테이블 헤더에 보여줄 내용
  // headerCheckboxSelection <- 생성일시 헤더에 체크박스 생성
  // checkboxSelection <- rowData부분에도 체크박스 생성
  // pinned <- pinned: 'left'로 작성하면 좌측으로
  // width <- width값 조정
  return (
    <div
      className="ag-theme-alpine"
      style={{ width: 750, height: 550, margin: 'auto auto' }}
    >
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={{
          editable: true,
          sortable: true,
          minWidth: 100,
          width: 300,
          filter: true,
          resizable: true,
          floatingFilter: true,
          flex: 1,
        }}
      ></AgGridReact>
    </div>
  );
}

export default PostTable;
