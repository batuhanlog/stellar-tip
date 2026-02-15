/**
 * Address Validation Tests — StellarTip Orange Belt
 *
 * Tests Stellar address format validation:
 * - Valid addresses: 56 characters, starts with 'G'
 * - Invalid addresses: wrong length, wrong prefix, empty
 */

describe('Stellar Address Validation', () => {
  /**
   * Validate a Stellar public key format.
   * A valid Stellar public key:
   * - Starts with 'G'
   * - Is exactly 56 characters long
   * - Contains only uppercase alphanumeric characters
   */
  function isValidStellarAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    if (address.length !== 56) return false;
    if (!address.startsWith('G')) return false;
    if (!/^[A-Z0-9]+$/.test(address)) return false;
    return true;
  }

  test('should accept a valid Stellar public key', () => {
    const validAddress = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';
    expect(isValidStellarAddress(validAddress)).toBe(true);
  });

  test('should accept the deployed contract address as valid format', () => {
    const contractAddress = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
    // Contract addresses start with 'C', not 'G' — this is a contract ID, not a public key
    expect(isValidStellarAddress(contractAddress)).toBe(false);
  });

  test('should reject an address that is too short', () => {
    const shortAddress = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV';
    expect(isValidStellarAddress(shortAddress)).toBe(false);
  });

  test('should reject an address that is too long', () => {
    const longAddress = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI00';
    expect(isValidStellarAddress(longAddress)).toBe(false);
  });

  test('should reject an address that does not start with G', () => {
    const badPrefix = 'XBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI';
    expect(isValidStellarAddress(badPrefix)).toBe(false);
  });

  test('should reject an empty string', () => {
    expect(isValidStellarAddress('')).toBe(false);
  });

  test('should reject null/undefined inputs', () => {
    expect(isValidStellarAddress(null as any)).toBe(false);
    expect(isValidStellarAddress(undefined as any)).toBe(false);
  });

  test('should reject addresses with lowercase characters', () => {
    const lowercase = 'Gbzxn7pirzgnmhga7muuuf4gwpy5aypv6ly4uv2gl6vjgiqrxfdnmadi';
    expect(isValidStellarAddress(lowercase)).toBe(false);
  });

  test('should reject addresses with special characters', () => {
    const special = 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXF-NMADI';
    expect(isValidStellarAddress(special)).toBe(false);
  });
});
