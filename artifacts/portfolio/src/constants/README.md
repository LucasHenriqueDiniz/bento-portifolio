# Constants

Este diretório contém todos os dados estáticos centralizados do portfolio.

## Arquivos

### `academicExperiences.ts`
Experiências acadêmicas (universidade, cursos, certificações).

**Uso:**
```typescript
import { academicExperiences } from '@/constants';

// Listar todas as experiências acadêmicas
academicExperiences.map(exp => (
  <div key={exp.institution}>
    <h3>{exp.degree} in {exp.field}</h3>
    <p>{exp.institution}</p>
  </div>
));
```

### `jobExperiences.ts`
Experiências profissionais (empregos, freelance, contratos).

**Uso:**
```typescript
import { jobExperiences } from '@/constants';

// Listar experiências de trabalho
jobExperiences.map(job => (
  <div key={job.company}>
    <h3>{job.position} at {job.company}</h3>
    <p>{job.description}</p>
  </div>
));
```

### `languages.ts`
Idiomas falados e níveis de proficiência.

**Uso:**
```typescript
import { languages } from '@/constants';

// Mostrar idiomas
languages.map(lang => (
  <div key={lang.code}>
    <span>{lang.name}</span>
    <span>{lang.proficiency}</span>
  </div>
));
```

### `contacts.ts`
Informações de contato e redes sociais.

**Uso:**
```typescript
import { contacts, primaryContacts, getContactByPlatform } from '@/constants';

// Usar contatos primários (top 4)
primaryContacts.map(contact => (
  <a href={contact.url} key={contact.platform}>
    {contact.label}
  </a>
));

// Buscar contato específico
const github = getContactByPlatform('GitHub');
```

## Como Adicionar Novos Dados

1. Edite o arquivo correspondente
2. Siga a interface TypeScript definida
3. Os dados serão automaticamente tipados e validados

## Exemplo Completo

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
