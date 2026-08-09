import WorkflowBuilder from "@/components/WorkflowBuilder";

export default async function WorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // If id is 'new', it's a blank canvas.
  // If id is 'template-1', we load the template.
  
  return (
    <div className="h-full w-full flex flex-col">
      <WorkflowBuilder workflowId={id} />
    </div>
  );
}
