# Ezhilops-v1.0

## Testimonials

Clients submit feedback via the **Share Your Feedback** form (`/#feedback`).
Submissions are emailed through Web3Forms with the subject
"New Testimonial from EOs Website" — nothing is published automatically.

To publish an approved testimonial (only if the client ticked the consent box),
add it to `testimonials.json` and push to `main`:

```json
[
  {
    "name": "Client Name",
    "role": "Job Title",
    "company": "Company",
    "rating": 5,
    "service": "Service they used",
    "quote": "Their feedback text."
  }
]
```

`name` and `quote` are required; the rest are optional. While the file is
empty (`[]`), the section shows a "Be the first to share" message instead.
Share `https://<your-site>/#feedback` with clients to collect feedback.
