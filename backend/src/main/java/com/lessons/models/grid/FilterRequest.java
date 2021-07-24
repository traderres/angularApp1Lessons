package com.lessons.models.grid;



import java.util.Map;

public class FilterRequest {

    private Map<String, ColumnFilter> filterModel;

    public FilterRequest() {}

    public FilterRequest(Map<String, ColumnFilter> filterModel) {
        this.filterModel = filterModel;
    }

    public Map<String, ColumnFilter> getFilterModel() {
        return filterModel;
    }

    public void setFilterModel(Map<String, ColumnFilter> filterModel) {
        this.filterModel = filterModel;
    }

    @Override
    public String toString() {
        return "FilterRequest{" +
                "filterModel=" + filterModel +
                '}';
    }
}
