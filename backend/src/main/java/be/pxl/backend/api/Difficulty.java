package be.pxl.backend.api;

public enum Difficulty {
    NORMAL(1.0, 50000),
    HARD(1.1, 100000);

    private final double multiplier;
    private final int eliteBonus;

    Difficulty(double multiplier, int eliteBonus) {
        this.multiplier = multiplier;
        this.eliteBonus = eliteBonus;
    }

    public double getMultiplier() {
        return multiplier;
    }

    public int getEliteBonus() {
        return eliteBonus;
    }
}
