import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PartsPicker from './page';
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() })
}));

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ items: [], has_more: false })
        })
    );
});
afterEach(() => {
    jest.clearAllMocks();
});

describe('PartsPicker', () => {
    it('renders the title and search input', async () => {
        render(<PartsPicker />);
        await waitFor(() => expect(screen.queryByText(/Loading solar parts database/i)).not.toBeInTheDocument());
        expect(screen.getByText(/Search Parts Database/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Search name, brand, SKU, or part type/i)).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
        render(<PartsPicker />);
        expect(screen.getByText(/Loading solar parts database/i)).toBeInTheDocument();
    });

    it('shows no parts found if list is empty', async () => {
        render(<PartsPicker />);
        await waitFor(() => expect(screen.getByText(/No parts found/i)).toBeInTheDocument());
    });
    
    it('can open and close the add part form', async () => {
        render(<PartsPicker />);
        await waitFor(() => expect(screen.queryByText(/Loading solar parts database/i)).not.toBeInTheDocument());
        const addButton = screen.getByRole('button', { name: /add new part/i });
        await waitFor(() => {
            fireEvent.click(addButton);
            expect(screen.getByText(/Add New Part/i)).toBeInTheDocument();
        });
        const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
        await waitFor(() => {
            fireEvent.click(cancelButtons[cancelButtons.length - 1]);
            expect(screen.queryByRole('heading', { name: /Add New Part/i })).not.toBeInTheDocument();
        });
    });
});