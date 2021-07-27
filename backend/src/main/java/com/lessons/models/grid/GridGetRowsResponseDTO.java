package com.lessons.models.grid;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

public class GridGetRowsResponseDTO {

    @JsonProperty("data")
    private List<Map<String, Object>> data;

    @JsonProperty("lastRow")
    private Integer lastRow;

    @JsonProperty("totalMatches")
    private Integer totalMatches;

    @JsonProperty("secondaryColumnFields")
    private List<String> secondaryColumnFields;

    @JsonProperty("lastRowInfo")
    private String lastRowInfo;

    // --------------- Constructor, Getters, and Setters -------------------------------/

    public GridGetRowsResponseDTO(List<Map<String, Object>> data, Integer totalMatches) {
        this.data = data;
        this.totalMatches = totalMatches;
    }

    public List<Map<String, Object>> getData() {
        return data;
    }

    public void setData(List<Map<String, Object>> data) {
        this.data = data;
    }

    public Integer getLastRow() {
        return lastRow;
    }

    public void setLastRow(Integer lastRow) {
        this.lastRow = lastRow;
    }

    public List<String> getSecondaryColumnFields() {
        return secondaryColumnFields;
    }

    public void setSecondaryColumnFields(List<String> secondaryColumnFields) {
        this.secondaryColumnFields = secondaryColumnFields;
    }

    public String getLastRowInfo() {
        return lastRowInfo;
    }

    public void setLastRowInfo(String lastRowInfo) {
        this.lastRowInfo = lastRowInfo;
    }

    public Integer getTotalMatches() {
        return totalMatches;
    }

    public void setTotalMatches(Integer totalMatches) {
        this.totalMatches = totalMatches;
    }
}
