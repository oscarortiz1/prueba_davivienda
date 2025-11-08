import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSurveyStore } from '../surveyStore';

describe('surveyStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useSurveyStore.getState();
    store.surveys = [];
    store.currentSurvey = null;
    store.isLoading = false;
    store.error = null;
  });

  it('should initialize with default state', () => {
    const store = useSurveyStore.getState();
    
    expect(store.surveys).toEqual([]);
    expect(store.currentSurvey).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('should set surveys', () => {
    const store = useSurveyStore.getState();
    const mockSurveys = [
      {
        id: '1',
        title: 'Test Survey 1',
        description: 'Description 1',
        creatorId: 'user-123',
        published: false,
      },
      {
        id: '2',
        title: 'Test Survey 2',
        description: 'Description 2',
        creatorId: 'user-123',
        published: true,
      },
    ];
    
    store.setSurveys(mockSurveys);
    expect(store.surveys).toEqual(mockSurveys);
    expect(store.surveys.length).toBe(2);
  });

  it('should set current survey', () => {
    const store = useSurveyStore.getState();
    const mockSurvey = {
      id: '1',
      title: 'Test Survey',
      description: 'Description',
      creatorId: 'user-123',
      published: false,
      questions: [],
    };
    
    store.setCurrentSurvey(mockSurvey);
    expect(store.currentSurvey).toEqual(mockSurvey);
  });

  it('should add survey to list', () => {
    const store = useSurveyStore.getState();
    const mockSurvey = {
      id: '1',
      title: 'New Survey',
      description: 'New Description',
      creatorId: 'user-123',
      published: false,
    };
    
    store.addSurvey(mockSurvey);
    expect(store.surveys.length).toBe(1);
    expect(store.surveys[0]).toEqual(mockSurvey);
  });

  it('should update survey in list', () => {
    const store = useSurveyStore.getState();
    const mockSurvey = {
      id: '1',
      title: 'Original Title',
      description: 'Original Description',
      creatorId: 'user-123',
      published: false,
    };
    
    store.setSurveys([mockSurvey]);
    
    const updatedSurvey = {
      ...mockSurvey,
      title: 'Updated Title',
    };
    
    store.updateSurvey(updatedSurvey);
    expect(store.surveys[0].title).toBe('Updated Title');
  });

  it('should remove survey from list', () => {
    const store = useSurveyStore.getState();
    const mockSurveys = [
      {
        id: '1',
        title: 'Survey 1',
        description: 'Description 1',
        creatorId: 'user-123',
        published: false,
      },
      {
        id: '2',
        title: 'Survey 2',
        description: 'Description 2',
        creatorId: 'user-123',
        published: false,
      },
    ];
    
    store.setSurveys(mockSurveys);
    expect(store.surveys.length).toBe(2);
    
    store.removeSurvey('1');
    expect(store.surveys.length).toBe(1);
    expect(store.surveys[0].id).toBe('2');
  });

  it('should set loading state', () => {
    const store = useSurveyStore.getState();
    
    store.setLoading(true);
    expect(store.isLoading).toBe(true);
    
    store.setLoading(false);
    expect(store.isLoading).toBe(false);
  });

  it('should set error', () => {
    const store = useSurveyStore.getState();
    const errorMessage = 'Test error';
    
    store.setError(errorMessage);
    expect(store.error).toBe(errorMessage);
  });

  it('should clear error', () => {
    const store = useSurveyStore.getState();
    
    store.setError('Test error');
    expect(store.error).toBe('Test error');
    
    store.clearError();
    expect(store.error).toBeNull();
  });
});
