import ClassicTemplate from './templates/ClassicTemplate'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'

const ResumePreview = ({ data, template, accentColor, classes = "" }) => {

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data} accentColor={accentColor} />;
      default:
        return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  }

  return (
    <div className='w-full bg-gray-100 overflow-hidden'>
      <div
        id="resume-preview"
        className={"origin-top w-[794px] border border-gray-200 print:shadow-none print:border-none " + classes}
        style={{ transform: 'scale(0.75)', transformOrigin: 'top left', marginBottom: '-25%' }}
      >
        {renderTemplate()}
      </div>

      <style>{`
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
              overflow: hidden;
            }
            body * {
              visibility: hidden;
            }
            #resume-preview, #resume-preview * {
              visibility: visible;
            }
            #resume-preview {
              position: absolute;
              left: 0;
              top: 0;
              width: 210mm;
              height: auto;
              margin: 0;
              padding: 0;
              transform: none !important;
              box-shadow: none !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default ResumePreview
