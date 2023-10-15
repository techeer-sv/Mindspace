import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { CellClickedEvent } from "ag-grid-community";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { ModalWidthAtom, ModalHeightAtom } from "@/recoil/state/resizeAtom";
import { nodeAtom } from "@/recoil/state/nodeAtom";
import { usePostListGetQuery } from "@/hooks/queries/board";

import { formatDateTime, DateTimeFormat } from "@/utils/dateTime";
import { BoardResponseDto } from "@/constants/types";
interface PostTableProps {
  onClickedId: (id: number) => void;
}

function PostTable({ onClickedId }: PostTableProps) {
  const selectedNodeInfo = useRecoilValue(nodeAtom);

  const { data: postListData } = usePostListGetQuery(selectedNodeInfo.id);

  const formatPostListData = (dataList: BoardResponseDto[]) => {
    return dataList?.map((data: BoardResponseDto) => ({
      ...data,
      updatedAt: formatDateTime(data.updatedAt, DateTimeFormat.Date),
    }));
  };

  const [columnDefs] = useState([
    { field: "title" },
    { field: "userNickname" },
    { field: "updatedAt" },
  ]);

  const onRowDataClicked = (params: CellClickedEvent) => {
    onClickedId(params.data.id);
  };

  const modalWidth = useRecoilValue(ModalWidthAtom);
  const modalHeight = useRecoilValue(ModalHeightAtom);

  return (
    <div
      className="ag-theme-alpine"
      style={{
        width: modalWidth - 70,
        height: modalHeight - 70,
        margin: "auto auto",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <AgGridReact
        rowData={formatPostListData(postListData)}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          minWidth: 100,
          width: 300,
          flex: 1,
        }}
        onCellClicked={onRowDataClicked}
      />
    </div>
  );
}

export default PostTable;
