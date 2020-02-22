import calculations

def test_calculateABV():
    assert calculations.calculateABV(1.0440, 1.0018) == 5.49
    assert calculations.calculateABV(1.045, 1.0094) == 4.59

    # Ridiculous values for determining abv, should equal 0
    assert calculations.calculateABV(100, 100) == 0
