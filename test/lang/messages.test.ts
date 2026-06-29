import { MESSAGES } from '../../src/lang/messages';

describe('Messages', () => {
  it('should have required APP messages', () => {
    expect(MESSAGES.APP.LOADING).toBeDefined();
    expect(MESSAGES.APP.TITLE).toBeDefined();
    expect(MESSAGES.APP.SUBTITLE).toBeDefined();
    expect(typeof MESSAGES.APP.TITLE).toBe('string');
  });

  it('should have required FORM messages', () => {
    expect(MESSAGES.FORM.TITLE_ADD).toBeDefined();
    expect(MESSAGES.FORM.TITLE_EDIT).toBeDefined();
    expect(MESSAGES.FORM.LABELS.FIRST_NAME).toBeDefined();
    expect(MESSAGES.FORM.PLACEHOLDERS.EMAIL).toBeDefined();
  });

  it('should have required LIST messages', () => {
    expect(MESSAGES.LIST.TITLE).toBeDefined();
    expect(MESSAGES.LIST.SEARCH_PLACEHOLDER).toBeDefined();
    expect(MESSAGES.LIST.TABLE_HEADERS.NAME).toBeDefined();
    expect(MESSAGES.LIST.VIEW_MODAL.TITLE).toBeDefined();
  });
});
