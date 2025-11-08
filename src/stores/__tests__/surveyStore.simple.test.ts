import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSurveyStore } from '../surveyStore';

describe('surveyStore - Basic Tests', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useSurveyStore());
    act(() => {
      result.current.setSurveys([]);
      result.current.setLoading(false);
    });
  });

  it('should initialize with empty surveys array', () => {
    const { result } = renderHook(() => useSurveyStore());
    expect(result.current.surveys).toEqual([]);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useSurveyStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.loading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.loading).toBe(false);
  });

  it('should setSurveys update the surveys list', () => {
    const { result } = renderHook(() => useSurveyStore());
    const mockSurveys = [
      {
        id: '1',
        title: 'Survey 1',
        description: 'Description 1',
        createdBy: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: false,
        questions: [],
      },
      {
        id: '2',
        title: 'Survey 2',
        description: 'Description 2',
        createdBy: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        questions: [],
      },
    ];

    act(() => {
      result.current.setSurveys(mockSurveys);
    });

    expect(result.current.surveys).toHaveLength(2);
    expect(result.current.surveys[0].title).toBe('Survey 1');
    expect(result.current.surveys[1].title).toBe('Survey 2');
  });

  it('should have correct initial loading state', () => {
    const { result } = renderHook(() => useSurveyStore());
    expect(result.current.loading).toBeDefined();
    expect(typeof result.current.loading).toBe('boolean');
  });
});
