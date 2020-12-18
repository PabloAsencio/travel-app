import { TestScheduler } from 'jest';
import { autocomplete } from '../src/client/js/autocomplete';

describe('Testing autocomplete.js', () => {
    test('Test that autocomplete is defined', () => {
        expect(autocomplete).toBeDefined();
    });
});
