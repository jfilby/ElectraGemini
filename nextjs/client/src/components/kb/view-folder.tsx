import { Checkbox, FormControlLabel, FormGroup, Link, Typography } from '@mui/material'

interface Props {
  instanceId: string
  folderFiles: any[]
  selected: string[]
  setSelected: any
}

export default function ViewFolder({
                          instanceId,
                          folderFiles,
                          selected,
                          setSelected
                        }: Props) {

  // Functions
  async function checkboxChanged(
                   folderFileId: string,
                   checked: boolean) {

    // Debug
    const fnName = `ViewFolder.checkboxChanged()`

    // Select/unselect
    var thisSelected = selected

    if (checked === true) {

      if (!thisSelected.includes(folderFileId)) {
        thisSelected.push(folderFileId)
      }
    } else {
      const i = thisSelected.indexOf(folderFileId)

      // splice(index, count of items to remove, items to add)
      thisSelected.splice(i, 1)
    }

    // console.log(`${fnName}: ${JSON.stringify(checked)}: ` +
    //            JSON.stringify(thisSelected))

    setSelected(thisSelected)
  }

  // Render
  return (
    <>
      {folderFiles.length > 0 ?
        <FormGroup>
          {folderFiles.map(folderFile => (
            <FormControlLabel
              key={folderFile.id}
              control={<Checkbox
                         name={`file:${folderFile.id}`}
                         onChange={(e) => {
                          checkboxChanged(
                            folderFile.id,
                            e.target.checked)
                         }} />}
              label={
                <p>
                  <Link href={`/instance/${instanceId}/document/${folderFile.id}`}>
                    {(folderFile.name)}
                  </Link>
                </p>
              } />
          ))}
        </FormGroup>
      :
        <Typography variant='body1'>
          No files or directories.
        </Typography>
      }
    </>
  )
}
