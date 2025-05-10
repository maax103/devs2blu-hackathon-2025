package com.example.javaservice.model;

import java.util.List;

public class Clause {
    private String clauseId;
    private Integer number;
    private String title;
    private String text;
    private String riskLevel;
    private List<String> categories;
    private List<String> issues;
    private List<String> recommendations;

    public Clause(String clauseId, Integer number, String title, String text, String riskLevel, List<String> categories, List<String> issues, List<String> recommendations) {
        this.clauseId = clauseId;
        this.number = number;
        this.title = title;
        this.text = text;
        this.riskLevel = riskLevel;
        this.categories = categories;
        this.issues = issues;
        this.recommendations = recommendations;
    }

    public Clause() {
    }

    public String getClauseId() {
        return clauseId;
    }

    public void setClauseId(String clauseId) {
        this.clauseId = clauseId;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public List<String> getIssues() {
        return issues;
    }

    public void setIssues(List<String> issues) {
        this.issues = issues;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }
}
