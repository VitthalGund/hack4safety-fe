"use client"
import { useState } from "react"
import type React from "react"

export const DataEntryForm = () => {
  const [formData, setFormData] = useState({
    caseNumber: "",
    filingDate: "",
    accusedName: "",
    section: "",
    court: "",
    judge: "",
    io: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // API call would go here
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Enter New Case</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Case Number */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Case Number</label>
              <input
                type="text"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleChange}
                placeholder="FIR-2024-001"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
            </div>

            {/* Filing Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Filing Date</label>
              <input
                type="date"
                name="filingDate"
                value={formData.filingDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
            </div>

            {/* Accused Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Accused Name</label>
              <input
                type="text"
                name="accusedName"
                value={formData.accusedName}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              />
            </div>

            {/* Section */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Section of Law</label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              >
                <option value="">Select section</option>
                <option value="ipc-302">IPC 302</option>
                <option value="ipc-307">IPC 307</option>
                <option value="ipc-420">IPC 420</option>
              </select>
            </div>

            {/* Court */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Court</label>
              <select
                name="court"
                value={formData.court}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                required
              >
                <option value="">Select court</option>
                <option value="dc-bangalore">District Court, Bangalore</option>
                <option value="hc-chennai">High Court, Chennai</option>
              </select>
            </div>

            {/* Judge */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Judge</label>
              <input
                type="text"
                name="judge"
                value={formData.judge}
                onChange={handleChange}
                placeholder="Judge name"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            {/* Investigating Officer */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Investigating Officer</label>
              <input
                type="text"
                name="io"
                value={formData.io}
                onChange={handleChange}
                placeholder="IO name"
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Case Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter case details..."
              rows={4}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Create Case
            </button>
            <button
              type="reset"
              className="px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
