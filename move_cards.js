const fs = require('fs');
const file = 'resources/js/pages/registrar/request-details.tsx';
let content = fs.readFileSync(file, 'utf8');

// The Left column ends before: {/* Right Column: Actions, Status & Payment */}
// We need to extract the Requested Documents Card and Deficiency Card.

const requestedDocsStart = content.indexOf('<Card>\n                        <CardHeader>\n                            <div className="flex items-center gap-2 text-foreground">\n                                <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">\n                                    <ClipboardList className="h-5 w-5" />');
const deficiencyEnd = content.indexOf('})()}\n\n                    </div>\n\n                    {/* Right Column: Actions, Status & Payment */}');

if (requestedDocsStart === -1 || deficiencyEnd === -1) {
    console.error("Could not find boundaries");
    process.exit(1);
}

const cardsToMove = content.substring(requestedDocsStart, deficiencyEnd + 6); // include '})()' 

// Remove from old location
let newContent = content.substring(0, requestedDocsStart) + content.substring(deficiencyEnd + 6);

// Insert after renderPaymentDetails()
const insertTarget = '{renderPaymentDetails()}\n                        \n';
const insertPos = newContent.indexOf(insertTarget);

if (insertPos === -1) {
    console.error("Could not find insert target");
    process.exit(1);
}

newContent = newContent.substring(0, insertPos + insertTarget.length) + '\n' + cardsToMove + '\n' + newContent.substring(insertPos + insertTarget.length);

fs.writeFileSync(file, newContent);
console.log("Moved successfully.");
