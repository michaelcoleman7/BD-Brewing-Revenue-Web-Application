import calculations

#Test for calculating ABV%
def test_calculateABV():
    assert calculations.calculateABV(1.0440, 1.0018) == 5.49
    assert calculations.calculateABV(1.045, 1.0094) == 4.59

    # Ridiculous values for determining abv, should equal 0
    assert calculations.calculateABV(100, 100) == 0

# Tsts for calculating post condition volumes of beer
def test_calculatePCV():
    assert calculations.calculatePCV(16, 131, 0) == 913
    assert calculations.calculatePCV(0, 161, 0) == 966
    assert calculations.calculatePCV(10, 0, 0) == 79
    assert calculations.calculatePCV(0, 0, 20) == 600
    assert calculations.calculatePCV(0, 0, 0) == 0
    assert calculations.calculatePCV(100, 100, 100) == 4392

def test_calculateDuty():
    assert calculations.calculateDuty(948, 5.46) == 582.31
    assert calculations.calculateDuty(966, 5.49) == 596.63
    assert calculations.calculateDuty(828, 4.90) == 456.44
