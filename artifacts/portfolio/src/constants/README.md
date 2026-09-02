# Constants

This directory holds every centralized static dataset of the portfolio.

## Files

### `academicExperiences.ts`
Academic experience (university, courses, certifications).

**Usage:**
```typescript
import { academicExperiences } from '@/constants';

// List every academic experience
academicExperiences.map(exp => (
  <div key={exp.institution}>
    <h3>{exp.degree} in {exp.field}</h3>
    <p>{exp.institution}</p>
  </div>
));
```

### `jobExperiences.ts`
Professional experience (jobs, freelance, contracts).

**Usage:**
```typescript
import { jobExperiences } from '@/constants';

// List work experience
jobExperiences.map(job => (
  <div key={job.company}>
    <h3>{job.position} at {job.company}</h3>
    <p>{job.description}</p>
  </div>
));
```

### `languages.ts`
Spoken languages and proficiency levels.

**Usage:**
```typescript
import { languages } from '@/constants';

// Show languages
languages.map(lang => (
  <div key={lang.code}>
    <span>{lang.name}</span>
    <span>{lang.proficiency}</span>
  </div>
));
```

### `contacts.ts`
Contact details and social profiles.

**Usage:**
```typescript
import { contacts, primaryContacts, getContactByPlatform } from '@/constants';

// Use the primary contacts (top 4)
primaryContacts.map(contact => (
  <a href={contact.url} key={contact.platform}>
    {contact.label}
  </a>
));

// Look up a specific contact
const github = getContactByPlatform('GitHub');
```

## How to add new data

1. Edit the matching file
2. Follow the TypeScript interface it declares
3. The data is typed and validated automatically

## Full example

```typescript
import { 
  academicExperiences, 
  jobExperiences, 
  languages, 
  contacts 
} from '@/constants';

function CVPage() {
  return (
    <div>
      <section>
        <h2>Experience</h2>
        {jobExperiences.map(job => (
          <JobCard key={job.company} {...job} />
        ))}
      </section>

      <section>
        <h2>Education</h2>
        {academicExperiences.map(edu => (
          <EducationCard key={edu.institution} {...edu} />
        ))}
      </section>

      <section>
        <h2>Languages</h2>
        {languages.map(lang => (
          <LanguageTag key={lang.code} {...lang} />
        ))}
      </section>

      <section>
        <h2>Contact</h2>
        {contacts.map(contact => (
          <ContactLink key={contact.platform} {...contact} />
        ))}
      </section>
    </div>
  );
}
```
