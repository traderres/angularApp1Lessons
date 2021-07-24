package com.lessons.models.grid;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

public class GridGetRowsResponseDTO {

    @JsonProperty("data")
    private List<Map<String, Object>> data;

    @JsonProperty("lastRow")
    private int lastRow;

    @JsonProperty("secondaryColumnFields")
    private List<String> secondaryColumnFields;


    // --------------- Constructor, Getters, and Setters -------------------------------/

    public GridGetRowsResponseDTO() {}

    public GridGetRowsResponseDTO(List<Map<String, Object>> data, int lastRow, List<String> secondaryColumnFields) {
        this.data = data;
        this.lastRow = lastRow;
        this.secondaryColumnFields = secondaryColumnFields;
    }

    public List<Map<String, Object>> getData() {
        return data;
    }

    public void setData(List<Map<String, Object>> data) {
        this.data = data;
    }

    public int getLastRow() {
        return lastRow;
    }

    public void setLastRow(int lastRow) {
        this.lastRow = lastRow;
    }

    public List<String> getSecondaryColumnFields() {
        return secondaryColumnFields;
    }

    public void setSecondaryColumnFields(List<String> secondaryColumnFields) {
        this.secondaryColumnFields = secondaryColumnFields;
    }
}
