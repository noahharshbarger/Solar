import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectsPage from './page';
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() })
}));

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ items: [], total: 0 })
        }))
})

afterEach(() => {
    jest.clearAllMocks();
})

describe('ProjectsPage', () => {
    it('renders the title and loading state', async () => {
        await waitFor(() => {
            render(<ProjectsPage />);
            expect(screen.getByText(/Projects/i)).toBeInTheDocument();
            expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
        });
    });
    it('shows no projects found if list is empty', async () => {
        render(<ProjectsPage />);
        await waitFor(() => expect(screen.getByText(/No projects found/i)).toBeInTheDocument());
    });
    it('renders a list of projects when data is available', async () => {
        const mockProjects = {
            items: [
                {
                    project_id: 'proj1',
                    project_name: 'Project One',
                    totals: {
                        domestic_total: 1000,
                        non_domestic_total: 200,
                        unknown_total: 50
                    }, 
                    designs: [
                        {
                            design_id: 'design1',
                            name: 'Design One',
                            ppw: 1.5,
                            base_system_price: 15000
                        }
                    ]
                }
            ]
        }
    })
})