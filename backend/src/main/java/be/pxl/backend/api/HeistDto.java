package be.pxl.backend.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HeistDto {
    private Difficulty difficulty;
    private boolean elite;
    private PrimaryTarget primaryTarget;
    private List<PlayerDto> players;

    public HeistDto(Difficulty difficulty, PrimaryTarget primaryTarget, boolean elite, List<PlayerDto> players) {
        this.difficulty = difficulty;
        this.primaryTarget = primaryTarget;
        this.elite = elite;
        this.players = players;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public boolean getElite() {
        return elite;
    }

    public void setElite(boolean elite) {
        this.elite = elite;
    }

    public PrimaryTarget getPrimaryTarget() {
        return primaryTarget;
    }

    public void setPrimaryTarget(PrimaryTarget primaryTarget) {
        this.primaryTarget = primaryTarget;
    }

    public List<PlayerDto> getPlayers() {
        return players;
    }

    public void setPlayers(List<PlayerDto> players) {
        this.players = players;
    }
}
