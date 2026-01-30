package be.pxl.backend.api;

public enum PrimaryTarget {
    TEQUILA("Tequila", 630000),
    RUBY_NECKLACE("Ruby Necklace", 700000),
    BEARER_BONDS("Bearer Bonds", 770000),
    PINK_DIAMOND("Pink Diamond", 1300000),
    MADRAZO_FILES("Madrazo Files", 1100000),
    PANTHER_STATUE("Panther Statue", 1900000);


    private final String name;
    private final int value;

    PrimaryTarget(String name, int value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public int getValue() {
        return value;
    }


}


