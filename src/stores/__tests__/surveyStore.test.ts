import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { useSurveyStore } from '../surveyStore';

vi.mock('axios', () => {
  const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    defaults: { baseURL: '' },
    interceptors: { request: { use: vi.fn() } },
  };
  return { default: mockAxios };
});

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe('surveyStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSurveyStore.setState({
      surveys: [],
      publishedSurveys: [],
      loading: false,
    });
  });

  it('starts with an empty survey collection', () => {
    const state = useSurveyStore.getState();
    expect(state.surveys).toEqual([]);
    expect(state.publishedSurveys).toEqual([]);
    expect(state.loading).toBe(false);
  });

  it('allows setting surveys and loading state', () => {
    const mockSurveys = [
      { id: '1', title: 'Survey 1', description: 'Desc 1' },
      { id: '2', title: 'Survey 2', description: 'Desc 2' },
    ];

    useSurveyStore.getState().setSurveys(mockSurveys);
    expect(useSurveyStore.getState().surveys).toEqual(mockSurveys);

    useSurveyStore.getState().setLoading(true);
    expect(useSurveyStore.getState().loading).toBe(true);
  });

  it('fetches surveys through refreshSurveys', async () => {
    const mockData = [{ id: 'survey-1', title: 'Remote Survey' }];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    await useSurveyStore.getState().refreshSurveys();

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/surveys/my-surveys');
    expect(useSurveyStore.getState().surveys).toEqual(mockData);
    expect(useSurveyStore.getState().loading).toBe(false);
  });

  it('fetches published surveys', async () => {
    const published = [{ id: 'pub-1', title: 'Published' }];
    mockedAxios.get.mockResolvedValueOnce({ data: published });

    await useSurveyStore.getState().refreshPublishedSurveys();

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/surveys/published');
    expect(useSurveyStore.getState().publishedSurveys).toEqual(published);
  });

  it('creates a survey and refreshes the list', async () => {
    const newSurvey = { id: 'created-1', title: 'New Survey' };
    mockedAxios.post.mockResolvedValueOnce({ data: newSurvey });
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const payload = { title: 'New Survey', description: 'Desc' };
    const result = await useSurveyStore.getState().createSurvey(payload);

    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8080/api/surveys', payload);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/surveys/my-surveys');
    expect(result).toEqual(newSurvey);
  });

  it('updates a survey via the API', async () => {
    const updatedSurvey = { id: 'survey-1', title: 'Updated' };
    mockedAxios.put.mockResolvedValueOnce({ data: updatedSurvey });
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const payload = { title: 'Updated', description: 'Desc' };
    const result = await useSurveyStore.getState().updateSurvey('survey-1', payload);

    expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:8080/api/surveys/survey-1', payload);
    expect(result).toEqual(updatedSurvey);
  });

  it('deletes a survey and refreshes', async () => {
    mockedAxios.delete.mockResolvedValueOnce({});
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    await useSurveyStore.getState().deleteSurvey('survey-1');

    expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:8080/api/surveys/survey-1');
    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/surveys/my-surveys');
  });

  it('publishes surveys', async () => {
    const publishedSurvey = { id: 'survey-1', published: true };
    mockedAxios.put.mockResolvedValueOnce({ data: publishedSurvey });
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const result = await useSurveyStore.getState().publishSurvey('survey-1');

    expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:8080/api/surveys/survey-1/publish');
    expect(result).toEqual(publishedSurvey);
  });

  it('manages questions via API helpers', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 'question-1' } });
    mockedAxios.put.mockResolvedValueOnce({ data: { id: 'question-1', text: 'Updated question' } });
    mockedAxios.delete.mockResolvedValueOnce({ data: {} });

    await useSurveyStore.getState().addQuestion('survey-1', { text: 'Question?' });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8080/api/surveys/survey-1/questions',
      { text: 'Question?' },
    );

    await useSurveyStore.getState().updateQuestion('survey-1', 'question-1', { text: 'Updated question' });
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'http://localhost:8080/api/surveys/survey-1/questions/question-1',
      { text: 'Updated question' },
    );

    await useSurveyStore.getState().deleteQuestion('survey-1', 'question-1');
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      'http://localhost:8080/api/surveys/survey-1/questions/question-1',
    );
  });
});
