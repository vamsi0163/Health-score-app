import React, { useState } from 'react';

const defaultValues = {
  steps: '',
  sleep_hours: '',
  heart_rate: '',
  calories: '',
  water_intake: '',
};

const fields = [
  { key: 'steps',        label: 'Daily Steps',          type: 'number', min: 0,  max: 100000, placeholder: 'e.g. 8000',  unit: 'steps' },
  { key: 'sleep_hours',  label: 'Sleep Hours',           type: 'number', min: 0,  max: 24,     placeholder: 'e.g. 7.5',   unit: 'hrs'   },
  { key: 'heart_rate',   label: 'Resting Heart Rate',    type: 'number', min: 20, max: 250,    placeholder: 'e.g. 72',    unit: 'bpm'   },
  { key: 'calories',     label: 'Calories Consumed',     type: 'number', min: 0,  max: 10000,  placeholder: 'e.g. 2000',  unit: 'kcal'  },
  { key: 'water_intake', label: 'Water Intake',          type: 'number', min: 0,  max: 20,     placeholder: 'e.g. 2.5',   unit: 'L'     },
];

export default function HealthForm({ onSubmit, loading }) {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  const validate = () => {
  const errs = {};
  fields.forEach(({ key, min, max, label }) => {
    const raw = values[key];
    const val = parseFloat(raw);
    if (raw === '' || raw === undefined) {
      errs[key] = `${label} is required`;
    } else if (isNaN(val) || val < min || val > max) {
      errs[key] = `${label} must be between ${min} and ${max}`;
    }
  });
  return errs;
};

  const handleChange = (key, val) => {
    setValues((v) => ({ ...v, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({
      steps:        parseInt(values.steps),
      sleep_hours:  parseFloat(values.sleep_hours),
      heart_rate:   parseInt(values.heart_rate),
      calories:     parseInt(values.calories),
      water_intake: parseFloat(values.water_intake),
    });
  };

  const fillDemo = () =>
    setValues({ steps: '6500', sleep_hours: '5.5', heart_rate: '85', calories: '1800', water_intake: '1.5' });

  return (
    <form onSubmit={handleSubmit} className="health-form">
      <div className="form-grid">
        {fields.map(({ key, label, placeholder, unit }) => (
          <div key={key} className={`form-group ${errors[key] ? 'has-error' : ''}`}>
            <label htmlFor={key}>{label}</label>
            <div className="input-wrap">
              <input
                id={key}
                type="number"
                step="any"
                placeholder={placeholder}
                value={values[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
              <span className="unit">{unit}</span>
            </div>
            {errors[key] && <p className="error-msg">{errors[key]}</p>}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={fillDemo}>
          Load Demo Data
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Calculating…' : 'Calculate Health Score'}
        </button>
      </div>
    </form>
  );
}
