import React from 'react';

import ShowIfRowReview from './ShowIfRowReview';
import type { FieldInputSchema, StepSchema } from '../types/jobApplication.types';

interface RenderSchemaReviewProps {
  schema: StepSchema;
  sectionValues: Record<string, any>;
  customRenderer?: Record<string, (value: any, field: FieldInputSchema) => React.ReactNode>;
}

export const RenderSchemaReview: React.FC<RenderSchemaReviewProps> = ({
  schema,
  sectionValues,
  customRenderer = {},
}) => {
  return (
    <>
      {schema.fields.map((field) => {
        const renderValue = customRenderer[field.id]
          ? (value: any) => customRenderer[field.id](value, field)
          : undefined;

        return (
          <ShowIfRowReview
            key={field.id}
            field={field}
            sectionValues={sectionValues}
            renderValue={renderValue as any}
          />
        );
      })}
    </>
  );
};

export default RenderSchemaReview;
