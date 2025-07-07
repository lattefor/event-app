import { render, screen } from '@testing-library/react'
import Footer from "@/components/shared/Footer"

describe('Footer Component Test', () => {
  it('renders Footer component', () => {
    render(<Footer />)
    expect(screen.getByText(/Events. All Rights reserved/)).toBeInTheDocument()
  })
})