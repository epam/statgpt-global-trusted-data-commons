import { getBannerConfig } from '../banner';

describe('getBannerConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns undefined when INFO_BANNER_MESSAGE is not set', () => {
    delete process.env.INFO_BANNER_MESSAGE;
    expect(getBannerConfig()).toBeUndefined();
  });

  it('returns undefined when INFO_BANNER_MESSAGE is an empty string', () => {
    process.env.INFO_BANNER_MESSAGE = '';
    expect(getBannerConfig()).toBeUndefined();
  });

  it('returns config with message only when no optional vars are set', () => {
    process.env.INFO_BANNER_MESSAGE = 'Test banner';
    delete process.env.INFO_BANNER_MODAL_TITLE;
    delete process.env.INFO_BANNER_MODAL_CONTENT;

    expect(getBannerConfig()).toEqual({
      message: 'Test banner',
      modalTitle: undefined,
      modalContent: undefined,
    });
  });

  it('maps all env vars to config fields', () => {
    process.env.INFO_BANNER_MESSAGE = 'Banner text';
    process.env.INFO_BANNER_MODAL_TITLE = 'Modal title';
    process.env.INFO_BANNER_MODAL_CONTENT = '## Heading\n\nParagraph text.';

    expect(getBannerConfig()).toEqual({
      message: 'Banner text',
      modalTitle: 'Modal title',
      modalContent: '## Heading\n\nParagraph text.',
    });
  });
});
