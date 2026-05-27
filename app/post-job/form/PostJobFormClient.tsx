"use client"

import type React from "react"
import { useState } from "react"
import TitleNormaliser from "@/components/ai/TitleNormaliser"
import { JobDescriptionAssistant } from "@/components/ai/JobDescriptionAssistant"

export default function PostJobFormClient() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [salary, setSalary] = useState("")
  const [type, setType] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const jobData = {
      title,
      description,
      company,
      location,
      salary,
      type,
    }

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      })

      if (response.ok) {
        // Handle successful job posting
        console.log("Job posted successfully!")
        // Reset form fields
        setTitle("")
        setDescription("")
        setCompany("")
        setLocation("")
        setSalary("")
        setType("")
      } else {
        // Handle error
        console.error("Failed to post job:", response.status)
      }
    } catch (error) {
      console.error("Error posting job:", error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <TitleNormaliser value={title} onAccept={(v) => setTitle(v)} />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <JobDescriptionAssistant value={description} />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="company"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
            Salary
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="salary"
              name="salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Job Type
          </label>
          <div className="mt-1">
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">Select Job Type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            required
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            I agree to the{" "}
            <a href="/terms" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
              Privacy Policy
            </a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  )
}
