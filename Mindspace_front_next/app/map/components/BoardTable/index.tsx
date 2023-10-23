import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { CellClickedEvent } from "ag-grid-community";
import { useRecoilValue } from "recoil";
import { ModalWidthAtom, ModalHeightAtom } from "@/recoil/state/resizeAtom";
import { nodeAtom } from "@/recoil/state/nodeAtom";
import { useBoardListGetQuery } from "@/api/hooks/queries/board";

import { formatDateTime, DateTimeFormat } from "@/utils/dateTime";
import { BoardResponseDto } from "@/constants/types";
interface BoardTableProps {
  onClickedId: (id: number) => void;
}

function BoardTable({ onClickedId }: BoardTableProps) {
  const selectedNodeInfo = useRecoilValue(nodeAtom);

  const { data: boardListData } = useBoardListGetQuery(selectedNodeInfo.id);

  const formatBoardListData = (dataList: BoardResponseDto[]) => {
    return dataList?.map((data: BoardResponseDto) => ({
      ...data,
      updatedAt: formatDateTime(data.updatedAt, DateTimeFormat.Date),
    }));
  };

  const onRowDataClicked = (params: CellClickedEvent) => {
    onClickedId(params.data.id);
  };

  const columnDefs = [
    { field: "title" },
    { field: "userNickname" },
    { field: "updatedAt" },
  ];

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
        rowData={formatBoardListData(boardListData)}
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

export default BoardTable;
