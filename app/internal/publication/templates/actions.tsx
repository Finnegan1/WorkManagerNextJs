'use server'

import prisma from '@/lib/prisma';
import { PdfTemplate } from '@prisma/client';

export type TemplateCreate = {
    name: string;
    description: string;
    basePdf: string;
    schemas: string;
    neededFields: string[];
}

// Create a new template
export async function createTemplate(template: TemplateCreate): Promise<PdfTemplate> {
    try {
        const newTemplate = await prisma.pdfTemplate.create({
            data: {
                name: template.name,
                description: template.description,
                basePdf: template.basePdf,
                schemas: JSON.stringify(template.schemas),
                neededFields: template.neededFields,
            },
        });
        return newTemplate;
    } catch (error) {
        console.error('Error creating template:', error);
        throw new Error(`Failed to create template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}


export async function getTemplates(): Promise<PdfTemplate[]> {
    try {
        const templates = await prisma.pdfTemplate.findMany();
        return templates;
    } catch (error) {
        console.error('Error fetching templates:', error);
        throw new Error('Failed to fetch templates');
    }
}

export async function getTemplate(id: number): Promise<PdfTemplate> {
    try {
        const template = await prisma.pdfTemplate.findUnique({
            where: { id },
        });
        if (!template) {
            throw new Error('Template not found');
        }
        return template;
    } catch (error) {
        console.error('Error fetching template:', error);
        throw new Error('Failed to fetch template');
    }
}

// Update a template
export async function updateTemplate(id: number, template: TemplateCreate): Promise<PdfTemplate> {
    try {
        const updatedTemplate = await prisma.pdfTemplate.update({
            where: { id },
            data: {
                name: template.name,
                description: template.description,
                basePdf: template.basePdf,
                schemas: template.schemas,
                neededFields: template.neededFields,
            },
        });
        return updatedTemplate;
    } catch (error) {
        console.error('Error updating template:', error);
        throw new Error('Failed to update template');
    }
}

// Delete a template
export async function deleteTemplate(id: number): Promise<void> {
    try {
        await prisma.pdfTemplate.delete({
            where: { id },
        });
    } catch (error) {
        console.error('Error deleting template:', error);
        throw new Error('Failed to delete template');
    }
}